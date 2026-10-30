import { Request, Response } from "express";
import { query } from "../config/db";
import { CreatePostDTO, Post, UpdatePostDTO } from "../types/post.types";

// GET all posts
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const result = await query<Post>(
            `SELECT * FROM posts ORDER BY created_at DESC`,
        );
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching posts: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET post by id
export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query<Post>(`SELECT * FROM posts WHERE id = $1`, [
            id,
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: "Post not found" });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error fetching post: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// CREATE a new post
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, author }: CreatePostDTO = req.body;

        if (!title || !content || !author) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }

        const insertQuery = `
            INSERT INTO posts (title, content, author)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await query<Post>(insertQuery, [title, content, author]);

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error creating post: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// UPDATE a post
export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { title, content }: UpdatePostDTO = req.body;

        if (!title && !content) {
            res.status(400).json({
                success: false,
                message: "Either title or content should be present",
            });
            return;
        }

        // Dynamic Partial Updates
        const updatePostQuery = `
            UPDATE posts
            SET
              title = COALESCE($1, title),
              content = COALESCE($2, content),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *;
        `;

        const result = await query<Post>(updatePostQuery, [
            title || null,
            content || null,
            id,
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "The post was not found",
            });
            return;
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error udpating post: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// DELETE a post
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleteQuery = `
            DELETE FROM posts WHERE id = $1 RETURNING id; 
        `;

        const result = await query(deleteQuery, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Post not found",
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: `Post deleted successfully with id ${id}`,
        });
    } catch (error) {
        console.error("Error deleting Post: ", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
