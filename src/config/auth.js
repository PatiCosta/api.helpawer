export default {
	secretAccessToken: process.env.APP_SECRET,
	expiresInAccessToken: '15s',
	expiresInRefreshToken: 1000 * 60 * 60 * 24 * 7, // 7 dias
}
