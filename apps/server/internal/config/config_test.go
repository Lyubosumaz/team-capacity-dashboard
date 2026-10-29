package config

import (
	"os"
	"path/filepath"
	"testing"
)

// unset clears key for this test only; t.Setenv puts it back afterwards.
func unset(t *testing.T, key string) {
	t.Setenv(key, "")
	os.Unsetenv(key)
}

func TestLoadEnvFile(t *testing.T) {
	unset(t, "FIRST")
	unset(t, "QUOTED")
	t.Setenv("ALREADY_SET", "from the environment")

	path := filepath.Join(t.TempDir(), "local.env")
	content := "# a comment\nFIRST=1\n\nQUOTED=\"two words\"\nALREADY_SET=from the file\n"
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}

	if err := LoadEnvFile(path); err != nil {
		t.Fatal(err)
	}

	want := map[string]string{
		"FIRST":       "1",
		"QUOTED":      "two words",
		"ALREADY_SET": "from the environment",
	}
	for key, value := range want {
		if got := os.Getenv(key); got != value {
			t.Errorf("%s = %q, want %q", key, got, value)
		}
	}
}

func TestLoadEnvFileWithoutFile(t *testing.T) {
	if err := LoadEnvFile(filepath.Join(t.TempDir(), "missing.env")); err != nil {
		t.Errorf("a missing file should be fine, got %v", err)
	}
}

func TestLoadDefaults(t *testing.T) {
	t.Chdir(t.TempDir()) // no local.env here
	unset(t, "DATABASE_URL")
	unset(t, "PORT")

	cfg, err := Load()
	if err != nil {
		t.Fatal(err)
	}

	if cfg.DatabaseURL != LocalDatabaseURL || cfg.Port != "4444" {
		t.Errorf("got %+v, want the local defaults", cfg)
	}
}
