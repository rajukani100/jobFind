package databse

import "context"

func SaveJwtTokens(userId, accessToken, refreshToken string) error {
	query := `INSERT INTO public.tokens(userid, accesstoken, refreshtoken) VALUES ($1, $2, $3)`
	_, err := ConnPool.Exec(context.Background(), query, userId, accessToken, refreshToken)
	return err
}

func UpdateJwtTokens(userId, accessToken, refreshToken string) error {
	query := `UPDATE public.tokens SET accesstoken = $2 , refreshtoken = $3 WHERE userid = $1;`
	_, err := ConnPool.Exec(context.Background(), query, userId, accessToken, refreshToken)
	return err
}
