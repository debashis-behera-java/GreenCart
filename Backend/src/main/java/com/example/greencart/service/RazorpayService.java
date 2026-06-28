package com.example.greencart.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    // CREATE RAZORPAY ORDER
  public String createOrder(Double amount)throws Exception {

        RazorpayClient client =
                new RazorpayClient(
                        key,
                        secret
                );

        JSONObject options =
                new JSONObject();

        options.put(
                "amount",
                (int)(amount * 100)
        );

        options.put(
                "currency",
                "INR"
        );

        options.put(
                "receipt",
                "txn_" + System.currentTimeMillis()
        );

        Order order =
                client.orders.create(options);

      return order.toString();
    }

    // VERIFY PAYMENT SIGNATURE
    public boolean verifyPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) throws Exception {

        String payload =
                razorpayOrderId
                        + "|"
                        + razorpayPaymentId;

        String actualSignature =
                hmacSHA256(
                        payload,
                        secret
                );

        return actualSignature.equals(
                razorpaySignature
        );
    }

    // HMAC SHA256
    private String hmacSHA256(
            String data,
            String secret
    ) throws Exception {

        javax.crypto.Mac sha256Hmac =
                javax.crypto.Mac.getInstance(
                        "HmacSHA256"
                );

        javax.crypto.spec.SecretKeySpec secretKey =
                new javax.crypto.spec.SecretKeySpec(
                        secret.getBytes(),
                        "HmacSHA256"
                );

        sha256Hmac.init(secretKey);

        byte[] hash =
                sha256Hmac.doFinal(
                        data.getBytes()
                );

        StringBuilder sb =
                new StringBuilder();

        for (byte b : hash) {

            sb.append(
                    String.format("%02x", b)
            );
        }

        return sb.toString();
    }
}