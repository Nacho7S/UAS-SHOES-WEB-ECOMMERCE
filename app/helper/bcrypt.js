import bcrypt from 'bcrypt';

export const hashPasswordSync = (password, saltRounds = 10) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePasswordSync = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

export const needsRehashSync = (hash, saltRounds = 10) => {
  return bcrypt.getRounds(hash) < saltRounds;
};