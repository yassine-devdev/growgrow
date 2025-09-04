import React, { useRef, useEffect, useState } from 'react';
import { Palette, Minus, Plus, Trash2, Pen, RectangleHorizontal, Circle, Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Tool = 'pen' | 'rect' | 'circle' | 'text';

const DesignerTab: React.FC = () => {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#4f46e5');
    const [lineWidth, setLineWidth] = useState(5);
    const [tool, setTool] = useState<Tool>('pen');
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [snapshot, setSnapshot] = useState<ImageData | null>(null);

    const tools: { id: Tool; label: string; icon: React.ElementType }[] = [
        { id: 'pen', label: t('views.studio.designer.pen'), icon: Pen },
        { id: 'rect', label: t('views.studio.designer.rectangle'), icon: RectangleHorizontal },
        { id: 'circle', label: t('views.studio.designer.circle'), icon: Circle },
        { id: 'text', label: t('views.studio.designer.text'), icon: Type },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        const resizeCanvas = () => {
            if (canvas.parentElement) {
                const tempSnapshot = context.getImageData(0, 0, canvas.width, canvas.height);
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                context.putImageData(tempSnapshot, 0, 0);
            }
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        context.lineCap = 'round';
        context.lineJoin = 'round';

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);
    
    const getContext = () => canvasRef.current?.getContext('2d');

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const context = getContext();
        if (!context) return;
        const { offsetX, offsetY } = e.nativeEvent;
        
        setIsDrawing(true);
        setStartPos({ x: offsetX, y: offsetY });
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setSnapshot(context.getImageData(0, 0, context.canvas.width, context.canvas.height));

        if (tool === 'pen') {
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
        } else if (tool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                context.fillStyle = color;
                context.font = `${lineWidth * 4}px sans-serif`;
                context.fillText(text, offsetX, offsetY);
            }
            setIsDrawing(false);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const context = getContext();
        if (!context || !snapshot) return;
        context.putImageData(snapshot, 0, 0); // Restore to previous state

        const { offsetX, offsetY } = e.nativeEvent;

        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.fillStyle = color;

        switch (tool) {
            case 'pen':
                context.lineTo(offsetX, offsetY);
                context.stroke();
                break;
            case 'rect':
                context.strokeRect(startPos.x, startPos.y, offsetX - startPos.x, offsetY - startPos.y);
                break;
            case 'circle':
                context.beginPath();
                const radius = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
                context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                context.stroke();
                break;
        }
    };

    const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const context = getContext();
        if (!context) return;
        
        if (tool === 'pen') {
            context.closePath();
        } else if (tool !== 'text') {
            // This re-draws the final shape after mouse up
            draw(e);
        }
        
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const context = getContext();
        if (context) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="p-2 bg-brand-surface border-b border-brand-border flex items-center gap-4 flex-wrap">
                {tools.map(t => (
                    <button 
                        key={t.id} 
                        onClick={() => setTool(t.id)} 
                        title={t.label}
                        className={`p-2 rounded-md ${tool === t.id ? 'bg-brand-primary/20 text-brand-primary' : 'hover:bg-brand-surface-alt'}`}
                    >
                        <t.icon className="w-5 h-5" />
                    </button>
                ))}
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 p-0 border-none bg-transparent"/>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setLineWidth(Math.max(1, lineWidth - 1))}><Minus className="w-5 h-5"/></button>
                    <span className="w-6 text-center">{lineWidth}px</span>
                    <button onClick={() => setLineWidth(Math.min(50, lineWidth + 1))}><Plus className="w-5 h-5"/></button>
                </div>
                <button onClick={clearCanvas} className="ml-auto p-2 hover:bg-red-500/10 rounded-md"><Trash2 className="w-5 h-5 text-red-500"/></button>
            </div>
            <div className="flex-1 bg-white relative">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default DesignerTab;