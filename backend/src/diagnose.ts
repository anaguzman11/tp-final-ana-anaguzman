import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/stock_db";

async function diagnose() {
    try {
        console.log('--- DIAGNÓSTICO DE BASE DE DATOS ---');
        console.log(`Conectando a: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado');

        const User = mongoose.connection.collection('users');
        const admin = await User.findOne({ email: 'admin@admin.com' });

        if (!admin) {
            console.log('❌ El usuario admin@admin.com NO EXISTE en la base de datos.');
        } else {
            console.log('✅ Usuario admin@admin.com encontrado:');
            console.log(`   ID: ${admin._id}`);
            console.log(`   Nombre: ${admin.name}`);
            console.log(`   Rol: ${admin.role}`);
            console.log(`   ¿Tiene password?: ${!!admin.password}`);
            console.log(`   Inicio del hash: ${admin.password ? admin.password.substring(0, 10) : 'N/A'}...`);
        }

        const allUsers = await User.find({}).toArray();
        console.log(`\nTotal de usuarios en la base de datos: ${allUsers.length}`);
        allUsers.forEach(u => console.log(` - ${u.email} (${u.role})`));

        await mongoose.disconnect();
        console.log('\n--- FIN DEL DIAGNÓSTICO ---');
    } catch (err) {
        console.error('❌ Error durante el diagnóstico:', err);
    }
}

diagnose();
