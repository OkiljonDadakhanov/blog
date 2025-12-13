"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, Loader2, Edit2, Trash2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const writingSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  title: z.string().min(1, "Title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
})

const noteSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  content: z.string().min(1, "Content is required"),
})

const bookSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
})

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().min(1, "Director is required"),
  year: z.string().optional(),
  reflection: z.string().min(1, "Reflection is required"),
})

const quoteSchema = z.object({
  text: z.string().min(1, "Quote text is required"),
  source: z.string().min(1, "Source is required"),
  context: z.string().optional(),
})

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("writing")
  const [items, setItems] = useState<any[]>([])
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteItem, setDeleteItem] = useState<any | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  const writingForm = useForm<z.infer<typeof writingSchema>>({
    resolver: zodResolver(writingSchema),
    defaultValues: {
      slug: "",
      title: "",
      date: new Date().toISOString().split("T")[0],
      excerpt: "",
      content: "",
    },
  })

  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      content: "",
    },
  })

  const bookForm = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      slug: "",
      title: "",
      author: "",
      year: "",
      date: new Date().toISOString().split("T")[0],
      excerpt: "",
      content: "",
    },
  })

  const movieForm = useForm<z.infer<typeof movieSchema>>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      director: "",
      year: "",
      reflection: "",
    },
  })

  const quoteForm = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      text: "",
      source: "",
      context: "",
    },
  })

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check")
      const data = await response.json()
      if (data.authenticated) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
        router.push("/admin/login")
      }
    } catch (error) {
      setAuthenticated(false)
      router.push("/admin/login")
    }
  }

  const fetchItems = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch items:", error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchItems(activeTab)
    }
  }, [activeTab, authenticated])

  useEffect(() => {
    if (authenticated) {
      setEditingItem(null)
      setEditDialogOpen(false)
      // Reset all forms when switching tabs
      writingForm.reset()
      noteForm.reset()
      bookForm.reset()
      movieForm.reset()
      quoteForm.reset()
    }
  }, [activeTab, authenticated])

  const handleSubmit = async (endpoint: string, data: any, form: any, isEdit: boolean = false) => {
    setLoading(endpoint)
    setSuccess(null)
    try {
      const url = `/api/${endpoint}`
      const method = isEdit ? "PUT" : "POST"
      
      // For books and writing, ensure slug is included in PUT requests
      const requestData = isEdit && (endpoint === "books" || endpoint === "writing") 
        ? { ...data, slug: editingItem?.slug }
        : data

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error("Failed to save")
      }

      setSuccess(endpoint)
      form.reset()
      setEditDialogOpen(false)
      setEditingItem(null)
      await fetchItems(endpoint)
      setTimeout(() => {
        setSuccess(null)
        router.refresh()
      }, 2000)
    } catch (error) {
      alert("Failed to save. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (endpoint: string, id: string | number) => {
    setLoading("delete")
    try {
      const isSlugBased = endpoint === "writing" || endpoint === "books"
      const response = await fetch(`/api/${endpoint}?${isSlugBased ? `slug=${id}` : `id=${id}`}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete")
      }

      setDeleteDialogOpen(false)
      setDeleteItem(null)
      await fetchItems(endpoint)
      router.refresh()
    } catch (error) {
      alert("Failed to delete. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const openEditDialog = (item: any, form: any) => {
    setEditingItem(item)
    form.reset(item)
    setEditDialogOpen(true)
  }

  const getCurrentForm = () => {
    switch (activeTab) {
      case "writing":
        return writingForm
      case "notes":
        return noteForm
      case "books":
        return bookForm
      case "movies":
        return movieForm
      case "quotes":
        return quoteForm
      default:
        return writingForm
    }
  }

  const renderItemList = () => {
    if (items.length === 0) {
      return <p className="text-muted-foreground text-sm">No items yet. Create your first one below.</p>
    }

    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-medium">Existing Items</h3>
        <div className="space-y-2">
          {items.map((item: any) => {
            const identifier = activeTab === "writing" || activeTab === "books" ? item.slug : item.id
            const displayTitle =
              activeTab === "writing" || activeTab === "books"
                ? item.title
                : activeTab === "notes"
                  ? item.content.substring(0, 50) + (item.content.length > 50 ? "..." : "")
                  : activeTab === "movies"
                    ? item.title
                    : item.text.substring(0, 50) + (item.text.length > 50 ? "..." : "")

            return (
              <div
                key={identifier}
                className="flex items-center justify-between p-3 border border-foreground/10 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{displayTitle}</p>
                  {item.date && <p className="text-xs text-muted-foreground mt-1">{item.date}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(item, getCurrentForm())}
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDeleteItem(item)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (authenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-normal mb-4">Admin</h1>
          <p className="text-lg text-muted-foreground mb-6">Create, edit, and delete content for your blog.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="ml-4">
          <LogOut className="size-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="writing">
          <div className="space-y-6">
            {renderItemList()}
            <div className="border border-foreground/10 rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Create New Post</h3>
              <Form {...writingForm}>
                <form
                  onSubmit={writingForm.handleSubmit((data) =>
                    handleSubmit("writing", data, writingForm, !!editingItem)
                  )}
                  className="space-y-6"
                >
                  <FormField
                    control={writingForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL-friendly, lowercase, hyphens only)</FormLabel>
                        <FormControl>
                          <Input placeholder="my-essay-title" {...field} disabled={!!editingItem} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={writingForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Essay Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={writingForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={writingForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A brief summary..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={writingForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (Markdown supported)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="# Title\n\nYour content here..." rows={12} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading === "writing"}>
                    {loading === "writing" ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        {editingItem ? "Updating..." : "Posting..."}
                      </>
                    ) : success === "writing" ? (
                      <>
                        <CheckCircle2 className="size-4 mr-2" />
                        {editingItem ? "Updated!" : "Posted!"}
                      </>
                    ) : (
                      editingItem ? "Update" : "Post"
                    )}
                  </Button>
                  {editingItem && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(null)
                        writingForm.reset()
                        setEditDialogOpen(false)
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="space-y-6">
            {renderItemList()}
            <div className="border border-foreground/10 rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Create New Note</h3>
              <Form {...noteForm}>
                <form
                  onSubmit={noteForm.handleSubmit((data) =>
                    handleSubmit("notes", { ...data, id: editingItem?.id }, noteForm, !!editingItem)
                  )}
                  className="space-y-6"
                >
                  <FormField
                    control={noteForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={noteForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your note..." rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading === "notes"}>
                    {loading === "notes" ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        {editingItem ? "Updating..." : "Posting..."}
                      </>
                    ) : success === "notes" ? (
                      <>
                        <CheckCircle2 className="size-4 mr-2" />
                        {editingItem ? "Updated!" : "Posted!"}
                      </>
                    ) : (
                      editingItem ? "Update" : "Post"
                    )}
                  </Button>
                  {editingItem && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(null)
                        noteForm.reset()
                        setEditDialogOpen(false)
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="books">
          <div className="space-y-6">
            {renderItemList()}
            <div className="border border-foreground/10 rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Create New Book</h3>
              <Form {...bookForm}>
                <form
                  onSubmit={bookForm.handleSubmit((data) =>
                    handleSubmit("books", data, bookForm, !!editingItem)
                  )}
                  className="space-y-6"
                >
                  <FormField
                    control={bookForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL-friendly, lowercase, hyphens only)</FormLabel>
                        <FormControl>
                          <Input placeholder="book-title-slug" {...field} disabled={!!editingItem} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Book Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookForm.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="1974" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A brief summary..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (Markdown supported)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="# Book Title\n\nYour reflection here..." rows={12} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading === "books"}>
                    {loading === "books" ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        {editingItem ? "Updating..." : "Posting..."}
                      </>
                    ) : success === "books" ? (
                      <>
                        <CheckCircle2 className="size-4 mr-2" />
                        {editingItem ? "Updated!" : "Posted!"}
                      </>
                    ) : (
                      editingItem ? "Update" : "Post"
                    )}
                  </Button>
                  {editingItem && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(null)
                        bookForm.reset()
                        setEditDialogOpen(false)
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="movies">
          <div className="space-y-6">
            {renderItemList()}
            <div className="border border-foreground/10 rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Create New Movie</h3>
              <Form {...movieForm}>
                <form
                  onSubmit={movieForm.handleSubmit((data) =>
                    handleSubmit("movies", { ...data, id: editingItem?.id }, movieForm, !!editingItem)
                  )}
                  className="space-y-6"
                >
                  <FormField
                    control={movieForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Movie Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={movieForm.control}
                    name="director"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Director</FormLabel>
                        <FormControl>
                          <Input placeholder="Director Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={movieForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="1979" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={movieForm.control}
                    name="reflection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reflection</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your thoughts on this movie..." rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading === "movies"}>
                    {loading === "movies" ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        {editingItem ? "Updating..." : "Posting..."}
                      </>
                    ) : success === "movies" ? (
                      <>
                        <CheckCircle2 className="size-4 mr-2" />
                        {editingItem ? "Updated!" : "Posted!"}
                      </>
                    ) : (
                      editingItem ? "Update" : "Post"
                    )}
                  </Button>
                  {editingItem && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(null)
                        movieForm.reset()
                        setEditDialogOpen(false)
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quotes">
          <div className="space-y-6">
            {renderItemList()}
            <div className="border border-foreground/10 rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Create New Quote</h3>
              <Form {...quoteForm}>
                <form
                  onSubmit={quoteForm.handleSubmit((data) =>
                    handleSubmit("quotes", { ...data, id: editingItem?.id }, quoteForm, !!editingItem)
                  )}
                  className="space-y-6"
                >
                  <FormField
                    control={quoteForm.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder="The quote..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={quoteForm.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Input placeholder="Author Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={quoteForm.control}
                    name="context"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Context (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Book or work title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading === "quotes"}>
                    {loading === "quotes" ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        {editingItem ? "Updating..." : "Posting..."}
                      </>
                    ) : success === "quotes" ? (
                      <>
                        <CheckCircle2 className="size-4 mr-2" />
                        {editingItem ? "Updated!" : "Posted!"}
                      </>
                    ) : (
                      editingItem ? "Update" : "Post"
                    )}
                  </Button>
                  {editingItem && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(null)
                        quoteForm.reset()
                        setEditDialogOpen(false)
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteItem) {
                  const identifier = activeTab === "writing" || activeTab === "books" ? deleteItem.slug : deleteItem.id
                  handleDelete(activeTab, identifier)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading === "delete" ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
