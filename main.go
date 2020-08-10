package main

import (
	"bufio"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func connectUDP() {
	address := &net.UDPAddr{IP: []byte{0, 0, 0, 0}, Port: 10001, Zone: ""}
	connection, err := net.DialUDP(address.Network(), nil, address)
	if err != nil {
		log.Fatalln(err)
		return
	}
	defer connection.Close()
	reader := bufio.NewReader(os.Stdin)
	for {
		text, _ := reader.ReadString('\n')
		text = strings.TrimSpace(text)
		connection.Write([]byte(text))
		if strings.ToLower(text) == "exit" {
			return
		}
	}
}
