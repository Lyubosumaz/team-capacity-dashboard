// Package migrations holds the SQL files that build the database tables.
// The server runs them in file-name order when it starts, each one only
// once. Never change a file that has already run: add a new numbered file.
package migrations

import "embed"

//go:embed *.sql
var Files embed.FS
