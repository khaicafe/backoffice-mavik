package models

import (
	"time"
)

type User struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"-"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `json:"-" sql:"index"`

	MobileNumber string    `gorm:"unique" json:"mobile_number"`
	Password     string    `json:"-"`
	OTP          string    `json:"-"`
	OTPExpiresAt time.Time `json:"-"`
	ResendCount  int       `json:"-"`
	Role         string    `gorm:"default:'user'" json:"role"`
}
