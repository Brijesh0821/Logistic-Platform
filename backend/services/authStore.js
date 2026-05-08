const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");

const dataDir = path.join(__dirname, "..", "data");
const usersFile = path.join(dataDir, "users.json");

const useMongo = () => mongoose.connection.readyState === 1;

const readLocalUsers = async () => {
  try {
    const data = await fs.readFile(usersFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
};

const writeLocalUsers = async (users) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
};

const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  company: user.company,
  isVerified: user.isVerified,
  password: user.password,
});

exports.isMongoConnected = useMongo;

exports.findByEmail = async (email) => {
  if (useMongo()) {
    return User.findOne({ email }).select("+password");
  }

  const users = await readLocalUsers();
  return users.find((user) => user.email === email) || null;
};

exports.create = async (payload) => {
  if (useMongo()) {
    const user = new User(payload);
    await user.save();
    return user;
  }

  const users = await readLocalUsers();
  if (users.some((user) => user.email === payload.email)) {
    const err = new Error("Duplicate local email");
    err.code = 11000;
    throw err;
  }

  const user = {
    ...payload,
    _id: `local_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(toPublicUser(user));
  await writeLocalUsers(users);
  return user;
};

exports.markVerified = async (user) => {
  if (useMongo() && typeof user.save === "function") {
    user.isVerified = true;
    await user.save();
    return user;
  }

  const users = await readLocalUsers();
  const nextUsers = users.map((item) =>
    item.email === user.email ? { ...item, isVerified: true, updatedAt: new Date().toISOString() } : item
  );
  await writeLocalUsers(nextUsers);
  user.isVerified = true;
  return user;
};
