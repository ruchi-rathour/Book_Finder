import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ViewToggle from './components/ViewToggle';
import ThemeToggle from './components/ThemeToggle';
import useBookSearch from './hooks/useBookSearch';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState('grid');
  const {
    books,
    loading,
    error,
    totalResults,
    currentQuery,
    hasMore,
    searchBooks,
    loadMore,
    retry,
    reset
  } = useBookSearch();

  // 🔥 Dynamic Title
  useEffect(() => {
    if (currentQuery) {
      document.title = `Results for “${currentQuery}” | Book Finder`;
    } else {
      document.title = "Book Finder - Discover Books Beyond Imagination";
    }
  }, [currentQuery]);

  const handleSearch = (query) => {
    searchBooks(query, 1, false);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const renderResults = () => {
    if (loading && books.length === 0) {
      return <LoadingSpinner />;
    }

    if (error && books.length === 0) {
      return (
        <ErrorMessage
          type="error"
          message={error}
          onRetry={retry}
        />
      );
    }

    if (!loading && books.length === 0 && currentQuery) {
      return (
        <ErrorMessage
          type="no-results"
          showRetryButton={false}
        />
      );
    }

    if (books.length === 0) {
      return null;
    }

    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold mb-1">
              Found {totalResults.toLocaleString()} books
            </h2>
            {currentQuery && (
              <p className="text-muted-foreground italic">
                Showing results for “{currentQuery}”
              </p>
            )}
          </div>
          <ViewToggle 
            viewMode={viewMode} 
            onViewModeChange={handleViewModeChange} 
          />
        </div>

        {/* Books Grid/List */}
        <motion.div 
          layout
          className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
              : 'space-y-4'
          }
        >
          {books.map((book, index) => (
            <motion.div
              key={`${book.key}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <BookCard 
                book={book} 
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-8">
            <Button
              onClick={loadMore}
              disabled={loading}
              variant="outline"
              size="lg"
              className="gap-2 rounded-2xl shadow hover:shadow-md transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  Loading more books...
                </>
              ) : (
                'Load More Books'
              )}
            </Button>
          </div>
        )}

        {/* Error message for load more */}
        {error && books.length > 0 && (
          <div className="text-center pt-4">
            <ErrorMessage
              type="error"
              title="Failed to load more books"
              message={error}
              onRetry={loadMore}
            />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Book Finder</h1>
            </motion.div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-12">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </section>

        {/* Results Section */}
        <section>
          {renderResults()}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 <span className="font-semibold">Book Finder</span>. Powered by{' '}
            <a 
              href="https://openlibrary.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Open Library
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
