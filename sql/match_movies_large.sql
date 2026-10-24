-- Create a function to search for movies_large
create or replace function match_movies_large (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    movies_large.id,
    movies_large.content,
    1 - (movies_large.embedding <=> query_embedding) as similarity
  from movies_large
  where 1 - (movies_large.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
