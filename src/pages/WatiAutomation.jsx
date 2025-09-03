import {
    ArrowRight,
    Copy,
    Download,
    Edit3,
    HelpCircle,
    Home,
    MessageSquare,
    MoreVertical,
    Play,
    RotateCcw,
    Save,
    Settings,
    Square,
    Star,
    Trash2,
    Zap,
    ZoomIn,
    ZoomOut,
    X
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const AutomationFlowBuilder = () => {
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [draggedNode, setDraggedNode] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [connectionMode, setConnectionMode] = useState(false);
    const [connectionStart, setConnectionStart] = useState(null);
    const [flowName, setFlowName] = useState('New WhatsApp Flow');
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [nodeMenuOpen, setNodeMenuOpen] = useState(null);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [editingNode, setEditingNode] = useState(null);
    const canvasRef = useRef(null);
    const [nodeCounter, setNodeCounter] = useState(1);

    // Node types configuration with WATI-style design
    const nodeTypes = [
        {
            type: 'message',
            icon: MessageSquare,
            label: 'Message',
            color: 'bg-gradient-to-r from-blue-500 to-blue-600',
            description: 'Send a message to the user'
        },
        {
            type: 'question',
            icon: HelpCircle,
            label: 'Question',
            color: 'bg-gradient-to-r from-orange-500 to-orange-600',
            description: 'Ask user a question with options'
        },
        {
            type: 'interactiveButtons',
            icon: Square,
            label: 'Interactive Buttons',
            color: 'bg-gradient-to-r from-green-500 to-green-600',
            description: 'Display interactive button menu'
        },
        {
            type: 'condition',
            icon: Settings,
            label: 'Condition',
            color: 'bg-gradient-to-r from-purple-500 to-purple-600',
            description: 'Add conditional logic to flow'
        }
    ];

    // Mouse position tracking
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Canvas controls
    const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.25));
    const resetZoom = () => {
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const fitToView = () => {
        if (nodes.length === 0) {
            resetZoom();
            return;
        }

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const padding = 100;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        nodes.forEach(node => {
            minX = Math.min(minX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxX = Math.max(maxX, node.position.x + 280);
            maxY = Math.max(maxY, node.position.y + 140);
        });

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        const availableWidth = canvasRect.width - padding * 2;
        const availableHeight = canvasRect.height - padding * 2;

        const scaleX = availableWidth / contentWidth;
        const scaleY = availableHeight / contentHeight;
        const newZoom = Math.min(scaleX, scaleY, 1);

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const canvasCenterX = canvasRect.width / 2;
        const canvasCenterY = canvasRect.height / 2;

        setZoom(newZoom);
        setPanOffset({
            x: canvasCenterX - centerX * newZoom,
            y: canvasCenterY - centerY * newZoom
        });
    };

    // Canvas panning
    const handleCanvasMouseDown = (e) => {
        if (e.button !== 0 || connectionMode || e.target.closest('.flow-node')) return;
        setIsPanning(true);
        setPanStart({
            x: e.clientX - panOffset.x,
            y: e.clientY - panOffset.y
        });
    };

    const handleCanvasMouseMove = (e) => {
        if (isPanning && !draggingNode) {
            setPanOffset({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            });
        }
    };

    const handleCanvasMouseUp = () => {
        setIsPanning(false);
    };

    // Wheel zoom
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.25, Math.min(3, zoom * delta));

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleFactor = newZoom / zoom;
        setPanOffset({
            x: mouseX - (mouseX - panOffset.x) * scaleFactor,
            y: mouseY - (mouseY - panOffset.y) * scaleFactor
        });

        setZoom(newZoom);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('wheel', handleWheel, { passive: false });
            return () => canvas.removeEventListener('wheel', handleWheel);
        }
    }, [zoom, panOffset]);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const getDefaultContent = (type) => {
        switch (type) {
            case 'message':
                return 'Hello! Welcome to our service. How can I help you today?';
            case 'question':
                return 'Please select one of the options below:';
            case 'interactiveButtons':
                return 'Choose from the menu options:';
            case 'condition':
                return 'Check if condition is met';
            default:
                return '';
        }
    };

    const getDefaultOptions = (type) => {
        if (type === 'question' || type === 'interactiveButtons') {
            return [
                { id: generateId(), text: 'Option 1', nodeResultId: '' },
                { id: generateId(), text: 'Option 2', nodeResultId: '' }
            ];
        }
        return [];
    };

    // Create new node
    const createNode = useCallback((type, position) => {
        const newNode = {
            id: `node_${type}_${generateId()}`,
            type,
            position,
            isStartNode: nodes.length === 0,
            data: {
                label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeCounter}`,
                content: getDefaultContent(type),
                options: getDefaultOptions(type),
                variable: type === 'question' ? 'user_response' : '',
                validation: type === 'question' ? 'None' : ''
            }
        };
        setNodes(prev => [...prev, newNode]);
        setNodeCounter(prev => prev + 1);
        return newNode;
    }, [nodeCounter, nodes.length]);

    // Handle canvas drop
    const handleCanvasDrop = useCallback((e) => {
        e.preventDefault();
        if (!draggedNode) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const position = {
            x: (e.clientX - rect.left - panOffset.x) / zoom - 140,
            y: (e.clientY - rect.top - panOffset.y) / zoom - 70
        };

        createNode(draggedNode.type, position);
        setDraggedNode(null);
        setIsDragging(false);
    }, [draggedNode, createNode, zoom, panOffset]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    // Node dragging with proper event handling
    const handleNodeMouseDown = (e, node) => {
        // Prevent dragging if clicking on menu or buttons
        if (e.target.closest('.node-menu') || 
            e.target.closest('.node-menu-trigger') ||
            e.target.closest('.connection-point') ||
            connectionMode) {
            return;
        }

        e.stopPropagation();
        e.preventDefault(); // Prevent text selection
        
        const rect = canvasRef.current.getBoundingClientRect();
        setDraggingNode(node.id);
        setDragOffset({
            x: (e.clientX - rect.left - panOffset.x) / zoom - node.position.x,
            y: (e.clientY - rect.top - panOffset.y) / zoom - node.position.y
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (draggingNode && canvasRef.current) {
            e.preventDefault();
            const rect = canvasRef.current.getBoundingClientRect();
            const newX = (e.clientX - rect.left - panOffset.x) / zoom - dragOffset.x;
            const newY = (e.clientY - rect.top - panOffset.y) / zoom - dragOffset.y;

            setNodes(prev => prev.map(node =>
                node.id === draggingNode
                    ? { ...node, position: { x: newX, y: newY } }
                    : node
            ));
        }
    }, [draggingNode, dragOffset, zoom, panOffset]);

    const handleMouseUp = useCallback(() => {
        setDraggingNode(null);
        setDragOffset({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        if (draggingNode) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [draggingNode, handleMouseMove, handleMouseUp]);

    // Connection handling
    const handleNodeConnection = (nodeId, optionId = null) => {
        if (!connectionStart) {
            setConnectionStart({ nodeId, optionId });
            setConnectionMode(true);
            return;
        }

        if (connectionStart.nodeId === nodeId) {
            setConnectionStart(null);
            setConnectionMode(false);
            return;
        }

        const connectionId = `edge_${connectionStart.nodeId}_${nodeId}_${generateId()}`;

        const newConnection = {
            id: connectionId,
            sourceNodeId: connectionStart.nodeId,
            targetNodeId: nodeId,
            sourceOptionId: connectionStart.optionId
        };

        if (connectionStart.optionId) {
            setNodes(prev => prev.map(node => {
                if (node.id === connectionStart.nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            options: node.data.options.map(opt =>
                                opt.id === connectionStart.optionId
                                    ? { ...opt, nodeResultId: nodeId }
                                    : opt
                            )
                        }
                    };
                }
                return node;
            }));
        }

        setConnections(prev => [...prev, newConnection]);
        setConnectionStart(null);
        setConnectionMode(false);
    };

    // Get connection points
    const getConnectionPoint = (node, isSource = false, optionId = null) => {
        const nodeWidth = 280;
        const nodeHeight = 140;

        if (isSource) {
            return {
                x: (node.position.x + nodeWidth / 2) * zoom + panOffset.x,
                y: (node.position.y + nodeHeight) * zoom + panOffset.y
            };
        } else {
            return {
                x: (node.position.x + nodeWidth / 2) * zoom + panOffset.x,
                y: (node.position.y) * zoom + panOffset.y
            };
        }
    };

    // Node menu functions
    const handleNodeMenuClick = (e, nodeId, action) => {
        e.stopPropagation();
        e.preventDefault();

        const node = nodes.find(n => n.id === nodeId);

        switch (action) {
            case 'edit':
                setEditingNode(node);
                setSelectedNode(node);
                break;
            case 'delete':
                setNodes(prev => prev.filter(n => n.id !== nodeId));
                setConnections(prev => prev.filter(c =>
                    c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
                ));
                if (selectedNode?.id === nodeId) setSelectedNode(null);
                if (editingNode?.id === nodeId) setEditingNode(null);
                break;
            case 'duplicate': {
                const duplicateNode = {
                    ...node,
                    id: `node_${node.type}_${generateId()}`,
                    position: {
                        x: node.position.x + 60,
                        y: node.position.y + 60
                    },
                    isStartNode: false,
                    data: {
                        ...node.data,
                        label: `${node.data.label} (Copy)`,
                        options: node.data.options.map(opt => ({
                            ...opt,
                            id: generateId(),
                            nodeResultId: ''
                        }))
                    }
                };
                setNodes(prev => [...prev, duplicateNode]);
                break;
            }
            case 'setStart':
                setNodes(prev => prev.map(n => ({
                    ...n,
                    isStartNode: n.id === nodeId
                })));
                break;
        }
        setNodeMenuOpen(null);
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.node-menu') && !e.target.closest('.node-menu-trigger')) {
                setNodeMenuOpen(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Enhanced Node Component
    const NodeComponent = ({ node }) => {
        const nodeType = nodeTypes.find(t => t.type === node.type);
        const Icon = nodeType?.icon || MessageSquare;
        const isBeingDragged = draggingNode === node.id;
        const isSelected = selectedNode?.id === node.id;

        const handleNodeClick = (e) => {
            if (connectionMode) {
                handleNodeConnection(node.id);
                return;
            }
            if (!draggingNode && !e.target.closest('.node-menu') && !e.target.closest('.node-menu-trigger')) {
                setSelectedNode(node);
            }
        };

        const handleMenuToggle = (e) => {
            e.stopPropagation();
            e.preventDefault();
            setNodeMenuOpen(nodeMenuOpen === node.id ? null : node.id);
        };

        return (
            <div
                className={`flow-node absolute bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'border-blue-400 shadow-2xl ring-4 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                } ${connectionMode ? 'hover:border-green-400' : ''} ${
                    isBeingDragged ? 'shadow-2xl scale-105 z-50 rotate-1' : ''
                }`}
                style={{
                    left: node.position.x * zoom + panOffset.x,
                    top: node.position.y * zoom + panOffset.y,
                    width: 280 * zoom,
                    minHeight: 140 * zoom,
                    zIndex: isSelected ? 20 : isBeingDragged ? 50 : 1,
                    userSelect: 'none'
                }}
                onClick={handleNodeClick}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
            >
                {/* Start Node Badge */}
                {node.isStartNode && (
                    <div className="absolute -top-3 -left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1 z-10">
                        <Star size={12} fill="white" />
                        START
                    </div>
                )}

                {/* Node Header */}
                <div className={`${nodeType?.color} text-white p-4 rounded-t-xl flex items-center gap-3 shadow-sm`}>
                    <div className="p-1 bg-white/20 rounded-lg">
                        <Icon size={18} />
                    </div>
                    <span className="font-semibold text-sm truncate flex-1">{node.data.label}</span>
                    
                    <div className="flex gap-2 items-center">
                        {/* Three-dot menu */}
                        <div className="relative">
                            <button
                                className="node-menu-trigger w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                                onClick={handleMenuToggle}
                            >
                                <MoreVertical size={16} />
                            </button>

                            {nodeMenuOpen === node.id && (
                                <div className="node-menu absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[100] min-w-[160px] overflow-hidden">
                                    <button
                                        onClick={(e) => handleNodeMenuClick(e, node.id, 'edit')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                                    >
                                        <Edit3 size={14} className="text-blue-500" />
                                        Edit Node
                                    </button>
                                    <button
                                        onClick={(e) => handleNodeMenuClick(e, node.id, 'duplicate')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 flex items-center gap-3 transition-colors"
                                    >
                                        <Copy size={14} className="text-green-500" />
                                        Duplicate
                                    </button>
                                    <button
                                        onClick={(e) => handleNodeMenuClick(e, node.id, 'setStart')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50 flex items-center gap-3 transition-colors"
                                    >
                                        <Star size={14} className="text-yellow-500" />
                                        Set as Start
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={(e) => handleNodeMenuClick(e, node.id, 'delete')}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete Node
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Connection point */}
                        <button
                            className={`connection-point w-6 h-6 rounded-full border-2 border-white transition-all ${
                                connectionStart?.nodeId === node.id && !connectionStart.optionId 
                                    ? 'bg-white ring-2 ring-white/50' : 'bg-white/30 hover:bg-white/50'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNodeConnection(node.id);
                            }}
                            title="Connect from this node"
                        />
                    </div>
                </div>

                {/* Node Content */}
                <div className="p-4">
                    <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {node.data.content}
                    </div>

                    {/* Options for Question/Interactive Buttons */}
                    {(node.type === 'question' || node.type === 'interactiveButtons') && node.data.options && (
                        <div className="space-y-2">
                            {node.data.options.slice(0, 3).map((option) => (
                                <div
                                    key={option.id}
                                    className={`text-xs px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                                        node.type === 'interactiveButtons'
                                            ? 'bg-green-50 hover:bg-green-100 border border-green-200 text-green-800'
                                            : 'bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (connectionMode) handleNodeConnection(node.id, option.id);
                                    }}
                                >
                                    <span className="truncate flex-1 font-medium">{option.text}</span>
                                    <div className="flex items-center gap-2">
                                        {option.nodeResultId && (
                                            <ArrowRight size={12} className="opacity-60" />
                                        )}
                                        <button
                                            className={`connection-point w-4 h-4 rounded-full border transition-all ${
                                                connectionStart?.nodeId === node.id && connectionStart?.optionId === option.id
                                                    ? 'bg-current border-current ring-1 ring-current/30'
                                                    : 'bg-current/20 border-current/40 hover:bg-current/40'
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNodeConnection(node.id, option.id);
                                            }}
                                            title="Connect from this option"
                                        />
                                    </div>
                                </div>
                            ))}
                            {node.data.options.length > 3 && (
                                <div className="text-xs text-gray-500 italic text-center py-1">
                                    +{node.data.options.length - 3} more options
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Connection Point */}
                <div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-colors shadow-sm connection-point"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (connectionMode && connectionStart) {
                            handleNodeConnection(node.id);
                        }
                    }}
                    title="Connect to this node"
                />
            </div>
        );
    };

    // Enhanced connection rendering
    const renderConnections = () => {
        const allConnections = [...connections];

        if (connectionMode && connectionStart) {
            const sourceNode = nodes.find(n => n.id === connectionStart.nodeId);
            if (sourceNode) {
                const sourcePoint = getConnectionPoint(sourceNode, true, connectionStart.optionId);
                allConnections.push({
                    id: 'temp-connection',
                    isTemp: true,
                    sourcePoint,
                    targetPoint: { x: mousePos.x, y: mousePos.y }
                });
            }
        }

        return (
            <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 0 }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    {allConnections.map(conn => (
                        <marker
                            key={`arrow-${conn.id}`}
                            id={`arrow-${conn.id}`}
                            markerWidth="14"
                            markerHeight="10"
                            refX="13"
                            refY="5"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path
                                d="M0,0 L0,10 L14,5 z"
                                fill={conn.isTemp ? "#10b981" : "#3b82f6"}
                                stroke="none"
                            />
                        </marker>
                    ))}
                </defs>

                {allConnections.map(conn => {
                    let sourcePoint, targetPoint;

                    if (conn.isTemp) {
                        sourcePoint = conn.sourcePoint;
                        targetPoint = conn.targetPoint;
                    } else {
                        const fromNode = nodes.find(n => n.id === conn.sourceNodeId);
                        const toNode = nodes.find(n => n.id === conn.targetNodeId);
                        if (!fromNode || !toNode) return null;

                        sourcePoint = getConnectionPoint(fromNode, true);
                        targetPoint = getConnectionPoint(toNode, false);
                    }

                    const dx = targetPoint.x - sourcePoint.x;
                    const dy = targetPoint.y - sourcePoint.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const curveStrength = Math.min(distance * 0.4, 120);

                    const controlPoint1 = {
                        x: sourcePoint.x,
                        y: sourcePoint.y + curveStrength
                    };

                    const controlPoint2 = {
                        x: targetPoint.x,
                        y: targetPoint.y - curveStrength
                    };

                    const pathData = `M ${sourcePoint.x} ${sourcePoint.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${targetPoint.x} ${targetPoint.y}`;

                    return (
                        <g key={conn.id}>
                            {/* Glow effect */}
                            <path
                                d={pathData}
                                stroke={conn.isTemp ? "#10b981" : "#3b82f6"}
                                strokeWidth="8"
                                fill="none"
                                opacity="0.2"
                                filter="url(#glow)"
                            />
                            {/* Main path */}
                            <path
                                d={pathData}
                                stroke={conn.isTemp ? "#10b981" : "#3b82f6"}
                                strokeWidth={conn.isTemp ? "3" : "3"}
                                fill="none"
                                markerEnd={`url(#arrow-${conn.id})`}
                                strokeDasharray={conn.isTemp ? "8,4" : "none"}
                                opacity={conn.isTemp ? "0.8" : "1"}
                                className="transition-all duration-200"
                            />
                        </g>
                    );
                })}
            </svg>
        );
    };

    // Enhanced Properties Panel
    const PropertiesPanel = () => {
        if (!selectedNode && !editingNode) {
            return (
                <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 p-6">
                    <h3 className="font-bold text-gray-800 mb-6 text-lg">Node Properties</h3>
                    <div className="text-center text-gray-500">
                        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <MessageSquare size={32} className="text-gray-400" />
                        </div>
                        <p className="font-medium mb-2">No node selected</p>
                        <p className="text-sm">Click on a node to edit its properties</p>
                    </div>
                </div>
            );
        }

        const currentNode = editingNode || selectedNode;

        const updateNodeData = (key, value) => {
            setNodes(prev => prev.map(node =>
                node.id === currentNode.id
                    ? { ...node, data: { ...node.data, [key]: value } }
                    : node
            ));
            if (editingNode) setEditingNode(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
            if (selectedNode) setSelectedNode(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
        };

        const addOption = () => {
            const newOption = { id: generateId(), text: `Option ${currentNode.data.options.length + 1}`, nodeResultId: '' };
            updateNodeData('options', [...currentNode.data.options, newOption]);
        };

        const updateOption = (optionId, key, value) => {
            const updatedOptions = currentNode.data.options.map(opt =>
                opt.id === optionId ? { ...opt, [key]: value } : opt
            );
            updateNodeData('options', updatedOptions);
        };

        const removeOption = (optionId) => {
            const updatedOptions = currentNode.data.options.filter(opt => opt.id !== optionId);
            updateNodeData('options', updatedOptions);
        };

        return (
            <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-lg">Edit Node</h3>
                        {editingNode && (
                            <button
                                onClick={() => setEditingNode(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Configure node properties</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Node Label */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Node Name
                        </label>
                        <input
                            type="text"
                            value={currentNode.data.label}
                            onChange={(e) => updateNodeData('label', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter node name"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {currentNode.type === 'message' ? 'Message Content' : 
                             currentNode.type === 'question' ? 'Question Text' :
                             currentNode.type === 'interactiveButtons' ? 'Button Menu Text' : 'Condition'}
                        </label>
                        <textarea
                            value={currentNode.data.content}
                            onChange={(e) => updateNodeData('content', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            placeholder="Enter your content here..."
                        />
                    </div>

                    {/* Variable for Questions */}
                    {currentNode.type === 'question' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Variable Name
                            </label>
                            <input
                                type="text"
                                value={currentNode.data.variable}
                                onChange={(e) => updateNodeData('variable', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="e.g., user_choice"
                            />
                        </div>
                    )}

                    {/* Options for Question/Interactive Buttons */}
                    {(currentNode.type === 'question' || currentNode.type === 'interactiveButtons') && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    {currentNode.type === 'interactiveButtons' ? 'Button Options' : 'Answer Options'}
                                </label>
                                <button
                                    onClick={addOption}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                                >
                                    Add Option
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {currentNode.data.options.map((option, index) => (
                                    <div key={option.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-medium text-gray-500">Option {index + 1}</span>
                                            <button
                                                onClick={() => removeOption(option.id)}
                                                className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                                                disabled={currentNode.data.options.length <= 1}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Option text"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Node Actions */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleNodeMenuClick(null, currentNode.id, 'setStart')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentNode.isStartNode
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {currentNode.isStartNode ? 'Start Node' : 'Set as Start'}
                            </button>
                            <button
                                onClick={() => handleNodeMenuClick(null, currentNode.id, 'duplicate')}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            >
                                Duplicate
                            </button>
                        </div>
                        <button
                            onClick={() => handleNodeMenuClick(null, currentNode.id, 'delete')}
                            className="w-full mt-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                        >
                            Delete Node
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Enhanced Export Function
    const exportFlow = () => {
        const flowData = {
            id: generateId(),
            name: flowName,
            description: "WhatsApp automation flow created with Flow Builder",
            version: "1.0",
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            settings: {
                zoom: zoom,
                panOffset: panOffset
            },
            nodes: nodes.map(node => ({
                id: node.id,
                type: node.type,
                position: {
                    x: Math.round(node.position.x),
                    y: Math.round(node.position.y)
                },
                isStartNode: node.isStartNode,
                data: {
                    label: node.data.label,
                    content: node.data.content,
                    ...(node.data.variable && { variable: node.data.variable }),
                    ...(node.data.validation && { validation: node.data.validation }),
                    ...(node.data.options && node.data.options.length > 0 && {
                        options: node.data.options.map(opt => ({
                            id: opt.id,
                            text: opt.text,
                            nextNodeId: opt.nodeResultId || null
                        }))
                    })
                }
            })),
            connections: connections.map(conn => ({
                id: conn.id,
                source: conn.sourceNodeId,
                target: conn.targetNodeId,
                sourceOption: conn.sourceOptionId || null
            })),
            metadata: {
                totalNodes: nodes.length,
                totalConnections: connections.length,
                nodeTypes: [...new Set(nodes.map(n => n.type))],
                hasStartNode: nodes.some(n => n.isStartNode)
            }
        };

        const blob = new Blob([JSON.stringify(flowData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${flowName.toLowerCase().replace(/\s+/g, '_')}_flow.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Enhanced Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <MessageSquare size={16} className="text-white" />
                                </div>
                                <input
                                    type="text"
                                    value={flowName}
                                    onChange={(e) => setFlowName(e.target.value)}
                                    className="text-xl font-bold bg-transparent border-none outline-none text-gray-800"
                                />
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Flow Builder
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                <button onClick={handleZoomOut} className="p-2 hover:bg-white rounded-md transition-colors" title="Zoom Out">
                                    <ZoomOut size={16} />
                                </button>
                                <span className="text-xs px-3 font-medium min-w-[60px] text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <button onClick={handleZoomIn} className="p-2 hover:bg-white rounded-md transition-colors" title="Zoom In">
                                    <ZoomIn size={16} />
                                </button>
                                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                <button onClick={resetZoom} className="p-2 hover:bg-white rounded-md transition-colors" title="Reset Zoom">
                                    <RotateCcw size={16} />
                                </button>
                                <button onClick={fitToView} className="p-2 hover:bg-white rounded-md transition-colors" title="Fit to View">
                                    <Home size={16} />
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setConnectionMode(!connectionMode);
                                    setConnectionStart(null);
                                }}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                                    connectionMode
                                        ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                                        : 'bg-white text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <Zap size={16} />
                                {connectionMode ? 'Exit Connect' : 'Connect Nodes'}
                            </button>

                            <button
                                onClick={() => {
                                    setNodes([]);
                                    setConnections([]);
                                    setSelectedNode(null);
                                    setEditingNode(null);
                                    setConnectionStart(null);
                                    setConnectionMode(false);
                                    setNodeMenuOpen(null);
                                }}
                                className="px-4 py-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg flex items-center gap-2 hover:border-gray-400 transition-all"
                            >
                                <Trash2 size={16} />
                                Clear All
                            </button>

                            <button
                                onClick={exportFlow}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium transition-all shadow-lg"
                            >
                                <Download size={16} />
                                Export Flow
                            </button>

                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition-all shadow-lg">
                                <Save size={16} />
                                Save
                            </button>

                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium transition-all shadow-lg">
                                <Play size={16} />
                                Test Flow
                            </button>
                        </div>
                    </div>

                    {connectionMode && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <Zap size={16} className="text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-green-800">Connection Mode Active</div>
                                    <div className="text-sm text-green-700">
                                        Click connection points on nodes to link them together
                                        {connectionStart && (
                                            <span className="ml-2 font-medium">
                                                • Connecting from: {nodes.find(n => n.id === connectionStart.nodeId)?.data.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex">
                {/* Enhanced Sidebar */}
                <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-6">
                        <h3 className="font-bold text-gray-800 mb-6 text-lg">Node Components</h3>

                        <div className="space-y-3">
                            {nodeTypes.map((nodeType) => {
                                const Icon = nodeType.icon;
                                return (
                                    <div
                                        key={nodeType.type}
                                        draggable
                                        onDragStart={(e) => {
                                            setDraggedNode(nodeType);
                                            setIsDragging(true);
                                            e.dataTransfer.effectAllowed = 'copy';
                                        }}
                                        onDragEnd={() => setIsDragging(false)}
                                        className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl cursor-grab transition-all duration-200 hover:border-gray-300 hover:shadow-lg active:scale-95"
                                    >
                                        <div className={`${nodeType.color} p-3 rounded-xl text-white shadow-sm group-hover:shadow-md transition-all`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 mb-1">{nodeType.label}</div>
                                            <div className="text-xs text-gray-600 leading-relaxed">{nodeType.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stats */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-3">Flow Statistics</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white rounded-lg p-2 text-center">
                                    <div className="font-bold text-blue-600">{nodes.length}</div>
                                    <div className="text-blue-700">Nodes</div>
                                </div>
                                <div className="bg-white rounded-lg p-2 text-center">
                                    <div className="font-bold text-green-600">{connections.length}</div>
                                    <div className="text-green-700">Connections</div>
                                </div>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-3">Quick Guide</h4>
                            <div className="text-xs text-purple-700 space-y-2">
                                <div>• Drag components to canvas</div>
                                <div>• Use mouse wheel to zoom</div>
                                <div>• Click and drag to pan canvas</div>
                                <div>• Click ⋮ menu for node options</div>
                                <div>• Use Connect mode to link nodes</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Main Canvas */}
                <div
                    ref={canvasRef}
                    className="relative flex-1 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden"
                    style={{
                        backgroundImage: `radial-gradient(circle, #9ca3af 1px, transparent 1px)`,
                        backgroundSize: `${25 * zoom}px ${25 * zoom}px`,
                        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
                        cursor: isPanning ? 'grabbing' : draggingNode ? 'grabbing' : 'grab'
                    }}
                    onDrop={handleCanvasDrop}
                    onDragOver={handleDragOver}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onClick={() => {
                        setSelectedNode(null);
                        setEditingNode(null);
                        setNodeMenuOpen(null);
                    }}
                >
                    {renderConnections()}
                    
                    {nodes.map(node => (
                        <NodeComponent key={node.id} node={node} />
                    ))}

                    {/* Empty State */}
                    {nodes.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-gray-400">
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                        <MessageSquare size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Start Building Your Flow</h3>
                                    <p className="text-gray-600">Drag components from the sidebar to create your WhatsApp automation flow</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Canvas Info */}
                    <div className="absolute bottom-6 left-6 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-600">
                            Zoom: {Math.round(zoom * 100)}%
                        </div>
                        {nodes.length > 0 && (
                            <>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="text-sm text-gray-600">
                                    {nodes.length} nodes • {connections.length} connections
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <PropertiesPanel />
            </div>
        </div>
    );
};

export default AutomationFlowBuilder;