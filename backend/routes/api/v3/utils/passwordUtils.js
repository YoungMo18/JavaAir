import bcrypt from 'bcryptjs';
// Hash a password
export async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds
    return await bcrypt.hash(password, saltRounds);
}

// Compare a plaintext password with a hashed password
export async function verifyPassword(plaintextPassword, hashedPassword) {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
}