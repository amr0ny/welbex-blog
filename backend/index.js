import config from './config.js';
import * as express from 'express';
import bodyParser from 'body-parser';
import { User, Post } from './Db.js';
import { SHA3 } from 'sha3';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const app = express.default();

const checkToken = (req, res, next) => {
  try {
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log(token);
    const verified = jwt.verify(token, config.SECRET_KEY);
    req.user = verified;
    next();
  } catch(error) {
    return res.status(401).json({ message: 'Invalid JWT token' });
  }
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json());

app.use('/api/createpost', checkToken);
app.use('/api/deletepost', checkToken);
app.use('/api/editpost', checkToken);

const setTimestamps = (timestamp) => {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // массив сокращенных названий месяцев
  const day = date.getDate(); // получаем день месяца
  const month = months[date.getMonth()]; // получаем сокращенное название месяца
  const year = date.getFullYear(); // получаем год
  const hours = date.getHours(); // получаем часы
  const minutes = date.getMinutes(); // получаем минуты
  const dateString = `${day} ${month} ${year}, ${hours}:${minutes}`;
  return dateString;
};


app.post('/api/usersregister', async (req, res) => {
  try {
    const hash = new SHA3(config.db.HASH);
    const password_hash = hash.update(req.body.password).digest('hex');
    const newUser = await User.create({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password_hash: password_hash.replace(/\s/g, "")});
    await newUser.save();
    const token = jwt.sign( {id: newUser.id }, config.SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

app.post('/api/userslogin', async (req, res) => {
  try {
    const user = await User.findOne({where: { email: req.body.email }});
    const hash = new SHA3(config.db.HASH);
    const password_hash = hash.update(req.body.password).digest('hex');
    if (password_hash == user.password_hash) {
      console.log('Authorized!');
      const token = jwt.sign({ id: user.id }, config.SECRET_KEY);
      res.json({ token });
    } else {
      res.json({error: 'Incorrect password!'});
    }
  } catch(error) {
    console.log(error.message);
    res.send(error.message);
  }
});

app.post('/api/createpost', async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const newPost = await Post.create({
        id: uuidv4(),
        message: req.body.message,
        timestamp: Date.now(),
        user_id: req.user.id
      });
      await newPost.setUser(user);
      await newPost.save();
    } else {
      res.json({message: "User is unauthorized"});
    }
  } catch(error) {
      console.log(error.message);
      res.json({message: "User is unauthorized"});
  }
});

app.post('/api/deletepost', async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const post = await Post.findByPk(req.body.post_id);
      if (post.getDataValue('user_id') == req.user.id) {
        await post.destroy();
      } else {
        return res.json({message: "User is unauthorized"});
      }
    } else {
      res.json({message: "User is unauthorized"});
    }
  } catch(error) {
      console.log(error.message);
      res.json({message: "User is unauthorized"});
  }
});

app.post('/api/editpost', async (req, res) => {
  try {
    console.log(req.body.post_id);
    if (req.user) {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const post = await Post.findByPk(req.body.post_id);
      if (post.getDataValue('user_id') == req.user.id) {
        await post.update({message: req.body.message});
      } else {
        return res.json({message: "User is unauthorized"});
      }
    } else {
      res.json({message: "User is unauthorized"});
    }
  } catch(error) {
      console.log(error.message);
      res.json({message: "User is unauthorized"});
  }
});

app.get('/api/posts', async (req, res) => {
  const data = await Post.findAll({
    order: [['timestamp', 'DESC']],
    include: User,
    limit: req.query.limit,
    offset: req.query.offset
});
  const count = await Post.count();
  const posts = data.map( row => {
    return {
      post_id: row.getDataValue('id'),
      name: row.user.getDataValue('name'),
      message: row.getDataValue('message'),
      timestamp: setTimestamps(row.getDataValue('timestamp'))
    }
  });
  if (!posts) {
    return res.status(404).json({ error: 'Posts not found!' });
  }
  res.json({count: count, posts: posts});
});

app.listen(3010, () => {
  console.log(`Server listening on ${3010}`);
});