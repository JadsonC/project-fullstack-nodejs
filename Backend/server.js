import 'dotenv/config';
import app from './src/app.js'

app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log(`API HelpDesk rodando em http://localhost:${process.env.SERVER_PORT || 3000}` );
})