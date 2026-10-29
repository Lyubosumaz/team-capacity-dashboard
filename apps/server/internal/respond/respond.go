// Package respond writes the API's JSON answers.
package respond

import (
	"encoding/json"
	"log"
	"net/http"
)

// JSON answers with data as JSON.
func JSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("writing the answer: %v", err)
	}
}

// Error answers {"error": message}.
func Error(w http.ResponseWriter, status int, message string) {
	JSON(w, status, map[string]string{"error": message})
}

// ServerError logs what went wrong and answers 500 without the details, so
// database errors never reach the browser.
func ServerError(w http.ResponseWriter, r *http.Request, err error) {
	log.Printf("%s %s: %v", r.Method, r.URL.Path, err)
	Error(w, http.StatusInternalServerError, "Something went wrong.")
}
