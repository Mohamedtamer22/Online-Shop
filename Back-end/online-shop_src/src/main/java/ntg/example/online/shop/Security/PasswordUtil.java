package ntg.example.online.shop.Security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public final class PasswordUtil {
    private static final String PREFIX = "sha256$";
    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordUtil() {
    }

    public static String hash(String password) {
        if (password == null || password.isBlank()) {
            return password;
        }
        if (isHashed(password)) {
            return password;
        }

        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        byte[] digest = digest(salt, password);
        return PREFIX + Base64.getEncoder().encodeToString(salt) + "$" + Base64.getEncoder().encodeToString(digest);
    }

    public static boolean matches(String rawPassword, String storedPassword) {
        if (rawPassword == null || storedPassword == null) {
            return false;
        }
        if (!isHashed(storedPassword)) {
            return rawPassword.equals(storedPassword);
        }

        String[] parts = storedPassword.split("\\$");
        if (parts.length != 3) {
            return false;
        }

        byte[] salt = Base64.getDecoder().decode(parts[1]);
        byte[] expected = Base64.getDecoder().decode(parts[2]);
        byte[] actual = digest(salt, rawPassword);
        return MessageDigest.isEqual(expected, actual);
    }

    public static boolean isHashed(String password) {
        return password != null && password.startsWith(PREFIX);
    }

    private static byte[] digest(byte[] salt, String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(salt);
            return digest.digest(password.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
