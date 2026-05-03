package com.bookcircle.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.bookcircle.dto.GeocodingResult;
import com.fasterxml.jackson.annotation.JsonProperty;

@Service
public class GoogleGeocodingService {

    private final RestClient restClient = RestClient.create();

    @Value("${google.maps.api-key:}")
    private String apiKey;

    @Value("${google.maps.geocoding-url:https://maps.googleapis.com/maps/api/geocode/json}")
    private String geocodingUrl;

    @Value("${google.maps.region:in}")
    private String region;

    public Optional<GeocodingResult> geocode(String location) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Google Maps API key is not configured");
        }

        String uri = UriComponentsBuilder.fromUriString(geocodingUrl)
                .queryParam("address", location)
                .queryParam("key", apiKey)
                .queryParamIfPresent("region", Optional.ofNullable(region).filter(value -> !value.isBlank()))
                .build()
                .toUriString();

        GeocodingResponse response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(GeocodingResponse.class);

        if (response == null || response.status() == null) {
            throw new IllegalStateException("Google Geocoding API returned an empty response");
        }

        if ("ZERO_RESULTS".equals(response.status())) {
            return Optional.empty();
        }

        if (!"OK".equals(response.status())) {
            String detail = response.errorMessage() == null ? response.status() : response.errorMessage();
            throw new IllegalArgumentException("Google Geocoding API failed: " + detail);
        }

        if (response.results() == null || response.results().isEmpty()) {
            return Optional.empty();
        }

        GeocodingItem firstResult = response.results().get(0);
        if (firstResult.geometry() == null || firstResult.geometry().location() == null) {
            return Optional.empty();
        }

        GeocodingLocation geocodingLocation = firstResult.geometry().location();

        return Optional.of(new GeocodingResult(
                geocodingLocation.lat(),
                geocodingLocation.lng(),
                firstResult.formattedAddress(),
                firstResult.geometry().locationType()
        ));
    }

    private record GeocodingResponse(
            String status,
            List<GeocodingItem> results,
            @JsonProperty("error_message") String errorMessage
    ) {}

    private record GeocodingItem(
            @JsonProperty("formatted_address") String formattedAddress,
            GeocodingGeometry geometry
    ) {}

    private record GeocodingGeometry(
            GeocodingLocation location,
            @JsonProperty("location_type") String locationType
    ) {}

    private record GeocodingLocation(double lat, double lng) {}
}
