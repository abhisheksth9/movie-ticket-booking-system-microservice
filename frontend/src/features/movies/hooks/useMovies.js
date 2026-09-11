import { useQuery } from "@tanstack/react-query";
import { fetchMovies, fetchMovieById } from "../api/moviesApi";

export function useMovies() {
    return useQuery({
        queryKey: ["movies"],
        queryFn: fetchMovies,
    });
}

export function useMovie(id) {
    return useQuery({
        queryKey: ["movies", id],
        queryFn: () => fetchMovieById(id),
        enabled: !!id,  // don't fire until id is available
    });
}