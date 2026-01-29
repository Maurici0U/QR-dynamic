import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    fileUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
        pdf: { maxFileSize: "8MB", maxFileCount: 1 },
        text: { maxFileSize: "64KB", maxFileCount: 1 },
        blob: { maxFileSize: "16MB", maxFileCount: 1 }
    })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on your server before upload
            const session = await getServerSession(authOptions);

            // If you throw, the user will not be able to upload
            if (!session?.user) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);

            // We will handle DB creation on the client side for simplicity in tracking 
            // specific file types in the UI, or we can do it here. 
            // For this refactor, let's return metadata to be used by the client.
            return { uploadedBy: metadata.userId, url: file.url, name: file.name };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
