package com.example.greencart.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileUploadService {

    private final String UPLOAD_DIR =
            System.getProperty("user.dir")
            + "/uploads/";

    public String uploadFile(MultipartFile file)
            throws IOException {

        // Create uploads folder
        File dir = new File(UPLOAD_DIR);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Unique filename
        String filename =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        // Full file path
        String filepath =
                UPLOAD_DIR + filename;

        // Save file
        file.transferTo(
                new File(filepath)
        );

        // Return accessible URL
        return "/uploads/" + filename;
    }
}