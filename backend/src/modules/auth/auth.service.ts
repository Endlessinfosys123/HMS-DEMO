import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';

export const registerUser = async (data: any) => {
    const { email, password, firstName, lastName, phone, roleName } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw { statusCode: 400, message: 'User already exists' };
    }

    let role = await prisma.role.findUnique({ where: { name: roleName || 'PATIENT' } });

    if (!role) {
        role = await prisma.role.create({ data: { name: roleName || 'PATIENT' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            roleId: role.id,
        },
        include: { role: true }
    });

    return user;
};

export const loginUser = async (data: any) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: { include: { permissions: true } } }
    });

    if (!user) {
        throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
        { id: user.id, roleId: user.roleId },
        process.env.JWT_SECRET || 'supersecretjwtkey',
        { expiresIn: '1d' }
    );

    return { user, token };
};
