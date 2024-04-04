import express from "express";
import config from 'config';
import exphbs from 'express-handlebars';
import routes from './routes';

const app = express();

// Настройка Handlebars как механизма представления
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
app.use('/', routes);

const PORT = config.get('port') || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});