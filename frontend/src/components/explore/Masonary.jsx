import React, { useEffect, useState } from 'react';
import { Image } from '../post/Image';

export const Masonary = ({ posts }) => {
    const [images, setImages] = useState([]);
    
    useEffect(() => {
        setImages(posts);
    }, [posts]);
    
    return (
        <div className='grid' style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            rowGap: '12px', 
            columnGap: '25px', 
            backgroundColor: 'white',  // Set background color here
            padding: '80px'  // Optional padding for aesthetics
        }}>
            {
                images?.map(item =>
                    <Image 
                        userId={item.owner} 
                        postId={item._id} 
                        likes={item.likes.length} 
                        comments={item.comments.length} 
                        key={item._id} 
                        src={item.files[0].link}
                    />
                )
            }
        </div>
    );
};
