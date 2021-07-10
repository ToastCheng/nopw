package main

import (
	"log"
	"net/http"

	"github.com/duo-labs/webauthn.io/session"
	"github.com/duo-labs/webauthn/webauthn"
	"github.com/gorilla/mux"
)

var webAuthn *webauthn.WebAuthn
var userDB *userdb
var sessionStore *session.Store
var allowedHeaders = "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization,X-CSRF-Token"

func main() {

	var err error
	webAuthn, err = webauthn.New(&webauthn.Config{
		RPDisplayName: "Toast Demo",            // Display Name for your site
		RPID:          "55f7d7469057.ngrok.io", // Generally the domain name for your site
		// RPID: "localhost", // Generally the domain name for your site
		RPOrigin: "https://55f7d7469057.ngrok.io",
		// RPOrigin: "http://localhost:30000", // The origin URL for WebAuthn requests
		// RPOrigin: "http://localhost:8080", // The origin URL for WebAuthn requests
		// RPIcon: "https://duo.com/logo.png", // Optional icon URL for your site
	})

	if err != nil {
		log.Fatal("failed to create WebAuthn from config:", err)
	}

	userDB = DB()

	sessionStore, err = session.NewStore()
	if err != nil {
		log.Fatal("failed to create session store:", err)
	}

	r := mux.NewRouter()

	r.HandleFunc("/register/begin/{username}", BeginRegistration).Methods("GET", "OPTIONS")
	r.HandleFunc("/register/finish/{username}", FinishRegistration).Methods("POST", "OPTIONS")
	r.HandleFunc("/login/begin/{username}", BeginLogin).Methods("GET", "OPTIONS")
	r.HandleFunc("/login/finish/{username}", FinishLogin).Methods("POST", "OPTIONS")

	// r.PathPrefix("/").Handler(http.FileServer(http.Dir("./build/")))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./")))

	serverAddress := ":8080"
	log.Println("starting server at", serverAddress)
	log.Fatal(http.ListenAndServe(serverAddress, r))
}
