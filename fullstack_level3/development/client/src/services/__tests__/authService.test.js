// src/services/__tests__/authService.test.js
import axios from "axios";
import { login, register, getCurrentUser, logout } from "../authService";

jest.mock("axios");

// -------------------------------------------------------------------
// login()
describe("authService.login", () => {
    const mockResponse = { data: { jwt: "fake-token", user: { id: 1, username: "test" } } };

    it("calls the correct endpoint and returns data on success", async () => {
        axios.post.mockResolvedValueOnce(mockResponse);
        const result = await login("test@example.com", "secret");
        expect(axios.post).toHaveBeenCalledWith(
            `${window._env_.VITE_API_URL}/auth/local`,
            { identifier: "test@example.com", password: "secret" }
        );
        expect(result).toEqual(mockResponse.data);
    });

    it("throws a friendly error when the API returns 400", async () => {
        const error = { response: { data: { error: { message: "Invalid credentials" } } } };
        axios.post.mockRejectedValueOnce(error);
        await expect(login("bad", "pwd")).rejects.toThrow("Invalid credentials");
    });
});

// -------------------------------------------------------------------
// register()
describe("authService.register", () => {
    it("posts the correct payload and returns data", async () => {
        const mockUser = { jwt: "abc", user: { id: 2 } };
        axios.post.mockResolvedValueOnce({ data: mockUser });
        const result = await register("newuser", "new@example.com", "pw123");
        expect(axios.post).toHaveBeenCalledWith(
            `${window._env_.VITE_API_URL}/auth/local/register`,
            { username: "newuser", email: "new@example.com", password: "pw123" }
        );
        expect(result).toEqual(mockUser);
    });
});

// -------------------------------------------------------------------
// getCurrentUser()
describe("authService.getCurrentUser", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("throws when no token is stored", async () => {
        await expect(getCurrentUser()).rejects.toThrow("No authentication token found");
    });

    it("calls /users/me with the stored token", async () => {
        localStorage.setItem("token", "my-jwt-token");
        const mockUser = { id: 3, username: "alice" };
        axios.get.mockResolvedValueOnce({ data: mockUser });
        const user = await getCurrentUser();
        expect(axios.get).toHaveBeenCalledWith(
            `${window._env_.VITE_API_URL}/users/me`,
            { headers: { Authorization: "Bearer my-jwt-token" } }
        );
        expect(user).toEqual(mockUser);
    });
});

// -------------------------------------------------------------------
// logout()
describe("authService.logout", () => {
    it("removes token and user from localStorage", () => {
        localStorage.setItem("token", "t");
        localStorage.setItem("user", '{"id":1}');
        logout();
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
    });
});