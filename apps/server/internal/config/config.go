// Package config reads the server's settings from the environment and
// from local.env.
package config

import (
	"errors"
	"io/fs"
	"os"
	"strings"
)

// LocalDatabaseURL is the database from docker-compose.yml.
const LocalDatabaseURL = "postgres://postgres:postgres@localhost:5432/team_capacity?sslmode=disable"

type Config struct {
	DatabaseURL string
	Port        string
}

// Load reads local.env, when it exists, and then the environment. Values
// already set in the environment win over the file. Anything missing gets
// the local development default.
func Load() (Config, error) {
	if err := LoadEnvFile("local.env"); err != nil {
		return Config{}, err
	}

	return Config{
		DatabaseURL: getOr("DATABASE_URL", LocalDatabaseURL),
		Port:        getOr("PORT", "4444"),
	}, nil
}

// LoadEnvFile sets each KEY=VALUE line of the file as an environment
// variable, unless it's already set. Empty lines and lines starting with
// # are skipped. A missing file is fine.
func LoadEnvFile(path string) error {
	data, err := os.ReadFile(path)
	if errors.Is(err, fs.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}

	for _, line := range strings.Split(string(data), "\n") {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		key, value, found := strings.Cut(line, "=")
		if !found {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)

		if _, isSet := os.LookupEnv(key); !isSet {
			if err := os.Setenv(key, value); err != nil {
				return err
			}
		}
	}

	return nil
}

func getOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
