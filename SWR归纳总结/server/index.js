const express = require('express');

const app = express();

app.get('/name', (req, res) => {
  // 获取url中的参数name
  const name = req.query.name;
  // 如果name为空，报错
  if (!name) return res.status(400).send('Error: Name is required');

  res.send({
    name,
  });
});


app.listen(8888, () => {
  console.log('Server is listening on port 8888');
});