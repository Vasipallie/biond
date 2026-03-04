

const SUPABASE_URL = 'https://pjxelrdlfhpqfflflhsj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NWuXNOZSTLJ-gRDWQSqbzQ_mVaaM6q8';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VideoManager = {
    
    async getAll() {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
        return data || [];
    },

    
    async getFeatured() {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('featured', true)
            .single();
        
        if (error && error.code !== 'PGRST116') { 
            console.error('Error fetching featured video:', error);
        }
        
        
        if (!data) {
            const allVideos = await this.getAll();
            return allVideos[0] || null;
        }
        return data;
    },

    
    async add(video) {
        
        if (video.featured) {
            await supabase
                .from('videos')
                .update({ featured: false })
                .eq('featured', true);
        }

        const { data, error } = await supabase
            .from('videos')
            .insert([{
                title: video.title,
                description: video.description,
                youtube_id: video.youtubeId,
                featured: video.featured || false
            }])
            .select()
            .single();
        
        if (error) {
            console.error('Error adding video:', error);
            return null;
        }
        return data;
    },

    
    async remove(id) {
        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Error removing video:', error);
            return false;
        }
        return true;
    },

    
    async setFeatured(id) {
        
        await supabase
            .from('videos')
            .update({ featured: false })
            .eq('featured', true);
        
        
        const { error } = await supabase
            .from('videos')
            .update({ featured: true })
            .eq('id', id);
        
        if (error) {
            console.error('Error setting featured video:', error);
            return false;
        }
        return true;
    }
};

window.VideoManager = VideoManager;
window.supabaseClient = supabase;
