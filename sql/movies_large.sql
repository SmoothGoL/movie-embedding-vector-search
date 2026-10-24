-- Create a table to store your movies
create table movies_large (
  id bigserial primary key,
  content text, -- corresponds to the "text chunk"
  embedding vector(3072)
);

grant select 
on public.movies_large 
to anon;

grant select, insert, update, delete 
on public.movies_large 
to authenticated;

grant select, insert, update, delete 
on public.movies_large 
to service_role;
