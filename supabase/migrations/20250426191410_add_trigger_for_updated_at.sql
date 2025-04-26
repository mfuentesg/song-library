CREATE TRIGGER playlists_updated_at_trigger AFTER UPDATE ON public.playlists FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();

CREATE TRIGGER songs_updated_at_trigger AFTER UPDATE ON public.songs FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();