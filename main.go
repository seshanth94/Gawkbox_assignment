package main


//import the necesssary packages
import (

	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"github.com/drone/routes"
)


/*client-id and setAcceptHeder are required to hit the twitch's API JSON data */

//twitch's client-id 
var client_id = "optopu9ae66ylre2lpi2jwzgdrwoyf"

// Request Header
var setAcceptHeader = "application/vnd.twitchtv.v5+json"

type Response struct {
	
	StreamChannel []StreamChannel `json:"streams"`
	Total int `json:"_total"`
	
}

// A Stream Struct to map every channel to.
type StreamChannel struct {
	Channel Channel `json:"channel"`
}

// A struct to map our channel which includes it's name,id and url
type Channel struct {
	Name string `json:"display_name"`
	Link string `json:"url"`
	Id int `json:"_id"`
}

func main() {
	mux := routes.New()

	//Configure a sample route
	mux.Get("/livestreams", GetValue)


	http.Handle("/", mux)
	log.Println("Listening...")


	//Run your server
	http.ListenAndServe(":4000", nil)
}


// GetValue - A sample handler function for the route /sample_route for your HTTP server
func GetValue(w http.ResponseWriter, r *http.Request) {
	
	
	// Root API to get the live JSON DATA for live creators
	url := "https://api.twitch.tv/kraken/streams/"

	spaceClient := http.Client{}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	
	req.Header.Set("Client-ID", client_id)
	req.Header.Set("Accept", setAcceptHeader)

	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}
	defer res.Body.Close()

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	//w.Write(body)


	var responseObject Response
	json.Unmarshal(body, &responseObject)
	json.NewEncoder(w).Encode(responseObject)
	
	

}







