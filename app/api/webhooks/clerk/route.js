import { Webhook } from "svix";
import { db } from "@/lib/prisma";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  if (!webhookSecret) {
    return Response.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  try {
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return Response.json(
        { error: "Missing svix headers" },
        { status: 400 }
      );
    }

    const body = await req.text();
    const wh = new Webhook(webhookSecret);

    let evt;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Failed to verify webhook signature:", err.message);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { id, type, data } = evt;

    // Handle user creation
    if (type === "user.created") {
      const { id: clerkUserId, email_addresses, first_name, last_name } = data;

      const email = email_addresses[0]?.email_address;

      if (!email) {
        return Response.json(
          { error: "No email provided" },
          { status: 400 }
        );
      }

      try {
        // Create user in database with PATIENT role by default
        const user = await db.user.create({
          data: {
            clerkUserId,
            email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || email,
            role: "PATIENT", // Default role
          },
        });

        return Response.json({
          success: true,
          message: "User created",
          userId: user.id,
        });
      } catch (error) {
        // If user already exists, just return success
        if (error.code === "P2002") {
          console.log("User already exists:", email);
          return Response.json({
            success: true,
            message: "User already exists",
          });
        }

        console.error("Error creating user:", error);
        return Response.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    }

    // Handle user deletion
    if (type === "user.deleted") {
      const { id: clerkUserId } = data;

      try {
        await db.user.delete({
          where: { clerkUserId },
        });

        return Response.json({
          success: true,
          message: "User deleted",
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        return Response.json(
          { error: "Failed to delete user" },
          { status: 500 }
        );
      }
    }

    // Handle user updates
    if (type === "user.updated") {
      const { id: clerkUserId, email_addresses, first_name, last_name } = data;

      const email = email_addresses[0]?.email_address;

      try {
        await db.user.update({
          where: { clerkUserId },
          data: {
            email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || email,
          },
        });

        return Response.json({
          success: true,
          message: "User updated",
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return Response.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
