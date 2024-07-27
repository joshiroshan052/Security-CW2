import React from 'react';
import Story from './Story';

export default function StoryContainer({ stories }) {
    return (
        <div>
            <h2 style={{ textAlign: 'left',marginLeft:"10px", margin: '5px 0' }}>Stories</h2>
            <div style={{ display: 'flex', overflowX: 'auto', padding: '5px', paddingLeft:"0px" }}>
                {stories.length === 0 && <p style={{ margin: 'auto', textAlign: 'center' }}>Nothing to see here</p>}
                {stories.map(story =>
                    <Story key={story[0].id} id={story[0].id} owner={story[0].owner} seen={[]} />
                )}
            </div>
        </div>
    );
}
