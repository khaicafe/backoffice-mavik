package utils

import (
	"github.com/twilio/twilio-go"
	api "github.com/twilio/twilio-go/rest/api/v2010"
)

func SendOTP(mobileNumber string, otp string) error {

	TWILIO_ACCOUNT_SID := "ACf5a9102d197c62b29764cbaa80fb6dc7"
	TWILIO_AUTH_TOKEN := "5cebb7724299bb275ebb99c4cf2e8f3d"
	TWILIO_PHONE_NUMBER := "+12363045765"

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: TWILIO_ACCOUNT_SID,
		Password: TWILIO_AUTH_TOKEN,
	})

	params := &api.CreateMessageParams{}
	params.SetTo(mobileNumber)
	params.SetFrom(TWILIO_PHONE_NUMBER)
	params.SetBody("Your OTP is: " + otp)

	_, err := client.Api.CreateMessage(params)
	return err
}
