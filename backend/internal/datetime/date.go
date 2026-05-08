package datetime

import "time"

func ParseDate(value string) (time.Time, error) {
	d, err := time.Parse("2006-01-02", value)
	if err != nil {
		return time.Time{}, err
	}
	return d.UTC(), nil
}
