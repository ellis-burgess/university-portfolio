# Sunrise Sunset

Building on an in-class exercise in Week 10 of Fundamentals of Programming, this is a website which, given a location and a date, returns the local sunrise and sunset time for that date.

This program fetches data from [Geoapify API](https://www.geoapify.com/) to get coordinates from a user-input location and to reverse-lookup coordinates from the user's location. It also uses the [Sunrise Sunset API](https://sunrise-sunset.org/api) to get sunrise and sunset times for the set location, on the set date.

This program uses the Geolocation API to get the user's location. Currently this implementation runs quite slowly, and I am unsure how to fix the issue.