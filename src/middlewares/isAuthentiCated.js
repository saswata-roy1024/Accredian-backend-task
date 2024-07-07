const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    next();
}

export default isAuthenticated;