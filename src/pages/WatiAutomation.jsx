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
    ZoomOut
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
    const [flowName, setFlowName] = useState('New Flow');
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [tempConnection, setTempConnection] = useState(null);
    const [nodeMenuOpen, setNodeMenuOpen] = useState(null);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const [nodeCounter, setNodeCounter] = useState(1);

    // Node types configuration
    const nodeTypes = [
        {
            type: 'message',
            icon: MessageSquare,
            label: 'Message',
            color: 'bg-blue-500',
            description: 'Send a text message to user'
        },
        {
            type: 'question',
            icon: HelpCircle,
            label: 'Question',
            color: 'bg-orange-500',
            description: 'Ask user a question with options'
        },
        {
            type: 'interactiveButtons',
            icon: Square,
            label: 'Interactive Buttons',
            color: 'bg-green-500',
            description: 'Display interactive buttons'
        },
        {
            type: 'condition',
            icon: Settings,
            label: 'Condition',
            color: 'bg-purple-500',
            description: 'Add conditional logic'
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

    // Canvas zoom and pan functions
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev * 1.2, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev / 1.2, 0.25));
    };

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
        const padding = 50;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        nodes.forEach(node => {
            minX = Math.min(minX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxX = Math.max(maxX, node.position.x + 240);
            maxY = Math.max(maxY, node.position.y + 120);
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
        if (e.button !== 0 || connectionMode) return; // Only left click

        const rect = canvasRef.current.getBoundingClientRect();
        setIsPanning(true);
        setPanStart({
            x: e.clientX - panOffset.x,
            y: e.clientY - panOffset.y
        });
    };

    const handleCanvasMouseMove = (e) => {
        if (isPanning) {
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

    // Create new node
    const createNode = useCallback((type, position) => {
        const newNode = {
            id: `main_${type}-${generateId()}`,
            type,
            position,
            isStartNode: nodes.length === 0,
            data: {
                label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeCounter}`,
                content: getDefaultContent(type),
                options: getDefaultOptions(type),
                variable: type === 'question' ? 'user_input' : '',
                validation: type === 'question' ? 'None' : '',
                header: type === 'interactiveButtons' ? { type: 'Text', text: 'Choose an option', media: null } : null,
                footer: type === 'interactiveButtons' ? '' : null
            }
        };
        setNodes(prev => [...prev, newNode]);
        setNodeCounter(prev => prev + 1);
        return newNode;
    }, [nodeCounter, nodes.length]);

    const generateId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const getDefaultContent = (type) => {
        switch (type) {
            case 'message':
                return '<p>Hello! How can I help you?</p>';
            case 'question':
                return '<p>What would you like to do?</p>';
            case 'interactiveButtons':
                return '<p>Please choose one of the options below:</p>';
            case 'condition':
                return 'If condition is true';
            default:
                return '';
        }
    };

    const getDefaultOptions = (type) => {
        if (type === 'question' || type === 'interactiveButtons') {
            return [
                { id: generateId(), text: 'Yes', nodeResultId: '' },
                { id: generateId(), text: 'No', nodeResultId: '' }
            ];
        }
        return [];
    };

    // Handle canvas drop
    const handleCanvasDrop = useCallback((e) => {
        e.preventDefault();
        if (!draggedNode) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const position = {
            x: (e.clientX - rect.left - panOffset.x) / zoom - 120,
            y: (e.clientY - rect.top - panOffset.y) / zoom - 60
        };

        createNode(draggedNode.type, position);
        setDraggedNode(null);
        setIsDragging(false);
    }, [draggedNode, createNode, zoom, panOffset]);

    // Handle drag over canvas
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    // Node dragging handlers
    const handleNodeMouseDown = (e, node) => {
        if (connectionMode || e.target.closest('.node-menu-trigger')) return;

        e.stopPropagation();
        const rect = canvasRef.current.getBoundingClientRect();
        setDraggingNode(node.id);
        setDragOffset({
            x: (e.clientX - rect.left) / zoom - node.position.x,
            y: (e.clientY - rect.top) / zoom - node.position.y
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (draggingNode && canvasRef.current) {
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

    // Handle connection creation
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

        const connectionId = optionId
            ? `reactflow__edge-${connectionStart.nodeId}${connectionStart.optionId}-${nodeId}`
            : `reactflow__edge-${connectionStart.nodeId}-${nodeId}`;

        const newConnection = {
            id: connectionId,
            sourceNodeId: connectionStart.optionId
                ? `${connectionStart.nodeId}__${connectionStart.optionId}`
                : connectionStart.nodeId,
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

    // Get connection points for a node
    const getConnectionPoint = (node, isSource = false, optionId = null) => {
        const nodeWidth = 240;
        const nodeHeight = 120;

        if (isSource) {
            if (optionId) {
                return {
                    x: (node.position.x + nodeWidth - 10) * zoom + panOffset.x,
                    y: (node.position.y + 60) * zoom + panOffset.y
                };
            } else {
                return {
                    x: (node.position.x + nodeWidth / 2) * zoom + panOffset.x,
                    y: (node.position.y + nodeHeight) * zoom + panOffset.y
                };
            }
        } else {
            return {
                x: (node.position.x + nodeWidth / 2) * zoom + panOffset.x,
                y: (node.position.y) * zoom + panOffset.y
            };
        }
    };

    // Node menu functions
    const handleNodeMenuClick = (nodeId, action) => {
        const node = nodes.find(n => n.id === nodeId);

        switch (action) {
            case 'edit':
                setSelectedNode(node);
                break;
            case 'delete':
                setNodes(prev => prev.filter(n => n.id !== nodeId));
                setConnections(prev => prev.filter(c =>
                    !c.sourceNodeId.includes(nodeId) && c.targetNodeId !== nodeId
                ));
                if (selectedNode?.id === nodeId) setSelectedNode(null);
                break;
            case 'setStart':
                setNodes(prev => prev.map(n => ({
                    ...n,
                    isStartNode: n.id === nodeId
                })));
                break;
            case 'duplicate': {
                const duplicateNode = {
                    ...node,
                    id: `main_${node.type}-${generateId()}`,
                    position: {
                        x: node.position.x + 50,
                        y: node.position.y + 50
                    },
                    isStartNode: false
                };
                setNodes(prev => [...prev, duplicateNode]);
                break;
            }
        }
        setNodeMenuOpen(null);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setNodeMenuOpen(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Node component with 3-dot menu
    const NodeComponent = ({ node }) => {
        const nodeType = nodeTypes.find(t => t.type === node.type);
        const Icon = nodeType?.icon || MessageSquare;
        const isBeingDragged = draggingNode === node.id;

        const handleNodeClick = (e) => {
            e.stopPropagation();
            if (connectionMode) {
                handleNodeConnection(node.id);
                return;
            }
            if (!draggingNode && !e.target.closest('.node-menu') && !e.target.closest('.node-menu-trigger')) {
                setSelectedNode(node);
            }
        };

        const handleMenuClick = (e) => {
            e.stopPropagation();
            setNodeMenuOpen(nodeMenuOpen === node.id ? null : node.id);
        };

        const handleOptionClick = (e, option) => {
            e.stopPropagation();
            if (connectionMode) {
                handleNodeConnection(node.id, option.id);
                return;
            }
        };

        const getContentText = (content) => {
            return content.replace(/<[^>]*>/g, '');
        };

        return (
            <div
                className={`absolute bg-white rounded-lg shadow-lg border-2 cursor-pointer min-w-[240px] max-w-[280px] transition-all duration-200 ${selectedNode?.id === node.id ? 'border-blue-500 shadow-xl' : 'border-gray-200'
                    } ${connectionMode ? 'hover:border-green-500' : ''} ${isBeingDragged ? 'shadow-2xl scale-105 z-50' : ''
                    }`}
                style={{
                    left: node.position.x * zoom + panOffset.x,
                    top: node.position.y * zoom + panOffset.y,
                    zIndex: selectedNode?.id === node.id ? 10 : isBeingDragged ? 50 : 1,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left'
                }}
                onClick={handleNodeClick}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
            >
                {/* Start Node Indicator */}
                {node.isStartNode && (
                    <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md flex items-center gap-1">
                        <Star size={10} fill="white" />
                        Start
                    </div>
                )}

                {/* Node Header */}
                <div className={`${nodeType?.color} text-white p-3 rounded-t-lg flex items-center gap-2`}>
                    <Icon size={16} />
                    <span className="font-medium text-sm truncate flex-1">{node.data.label}</span>
                    <div className="flex gap-1 items-center">
                        {/* 3-dot menu */}
                        <div className="relative">
                            <button
                                className="node-menu-trigger w-6 h-6 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                                onClick={handleMenuClick}
                            >
                                <MoreVertical size={14} />
                            </button>

                            {nodeMenuOpen === node.id && (
                                <div className="node-menu absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-[100] min-w-[140px]">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNodeMenuClick(node.id, 'edit');
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <Edit3 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNodeMenuClick(node.id, 'duplicate');
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <Copy size={14} />
                                        Duplicate
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNodeMenuClick(node.id, 'setStart');
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <Star size={14} />
                                        Set as Start
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNodeMenuClick(node.id, 'delete');
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Output Connection Point */}
                        <button
                            className={`w-4 h-4 rounded-full hover:bg-white/50 transition-colors ${connectionStart?.nodeId === node.id && !connectionStart.optionId ? 'bg-white ring-2 ring-white/50' : 'bg-white/30'
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
                <div className="p-3">
                    <div className="text-sm text-gray-700 mb-2 line-clamp-3">
                        {getContentText(node.data.content)}
                    </div>

                    {/* Options for Question/Interactive Buttons */}
                    {(node.type === 'question' || node.type === 'interactiveButtons') && node.data.options && (
                        <div className="space-y-1">
                            {node.data.options.slice(0, 3).map((option) => (
                                <div
                                    key={option.id}
                                    className={`text-xs px-2 py-1 rounded cursor-pointer flex items-center justify-between transition-colors ${node.type === 'interactiveButtons'
                                            ? 'bg-green-100 hover:bg-green-200 border border-green-200'
                                            : 'bg-orange-100 hover:bg-orange-200 border border-orange-200'
                                        }`}
                                    onClick={(e) => handleOptionClick(e, option)}
                                >
                                    <span className="truncate flex-1">{option.text}</span>
                                    <div className="flex items-center gap-1">
                                        {option.nodeResultId && (
                                            <ArrowRight size={12} className="text-gray-500" />
                                        )}
                                        <button
                                            className={`w-3 h-3 rounded-full hover:bg-current/30 transition-colors ${connectionStart?.nodeId === node.id && connectionStart?.optionId === option.id
                                                    ? 'bg-current ring-1 ring-current/50'
                                                    : 'bg-current/20'
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
                                <div className="text-xs text-gray-500 italic">
                                    +{node.data.options.length - 3} more options
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Connection Point at Top */}
                <div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full cursor-pointer hover:bg-blue-500 border-2 border-white transition-colors shadow-sm"
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
            <svg
                className="absolute inset-0 pointer-events-none w-full h-full"
                style={{ zIndex: 0 }}
            >
                <defs>
                    {allConnections.map(conn => (
                        <marker
                            key={`arrowhead-${conn.id}`}
                            id={`arrowhead-${conn.id}`}
                            markerWidth="12"
                            markerHeight="8"
                            refX="11"
                            refY="4"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path
                                d="M0,0 L0,8 L12,4 z"
                                fill={conn.isTemp ? "#10b981" : "#3b82f6"}
                                stroke={conn.isTemp ? "#10b981" : "#3b82f6"}
                                strokeWidth="0.5"
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
                        const sourceId = conn.sourceNodeId.includes('__')
                            ? conn.sourceNodeId.split('__')[0]
                            : conn.sourceNodeId;
                        const targetId = conn.targetNodeId;

                        const fromNode = nodes.find(n => n.id === sourceId);
                        const toNode = nodes.find(n => n.id === targetId);

                        if (!fromNode || !toNode) return null;

                        sourcePoint = getConnectionPoint(fromNode, true, conn.sourceOptionId);
                        targetPoint = getConnectionPoint(toNode, false);
                    }

                    const dx = targetPoint.x - sourcePoint.x;
                    const dy = targetPoint.y - sourcePoint.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const curveStrength = Math.min(distance * 0.3, 100);

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
                            <path
                                d={pathData}
                                stroke={conn.isTemp ? "#10b981" : "#3b82f6"}
                                strokeWidth="6"
                                fill="none"
                                opacity="0.1"
                                filter="blur(2px)"
                            />

                            <path
                                d={pathData}
                                stroke={conn.isTemp ? "#10b981" : "#3b82f6"}
                                strokeWidth={conn.isTemp ? "3" : "2"}
                                fill="none"
                                markerEnd={`url(#arrowhead-${conn.id})`}
                                strokeDasharray={conn.isTemp ? "8,4" : "none"}
                                opacity={conn.isTemp ? "0.8" : "1"}
                                className="transition-all duration-200"
                            />

                            {!conn.isTemp && conn.sourceOptionId && (
                                <text
                                    x={(sourcePoint.x + targetPoint.x) / 2}
                                    y={(sourcePoint.y + targetPoint.y) / 2 - 5}
                                    fontSize="10"
                                    fill="#6b7280"
                                    textAnchor="middle"
                                    className="pointer-events-none select-none"
                                >
                                    option
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    // Properties panel (simplified for space)
    const PropertiesPanel = () => {
        if (!selectedNode) {
            return (
                <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Properties</h3>
                    <div className="text-center text-gray-500 text-sm">
                        <MessageSquare className="mx-auto mb-2" size={32} />
                        <p>Select a node to edit its properties</p>
                    </div>
                </div>
            );
        }

        const updateNodeData = (key, value) => {
            setNodes(prev => prev.map(node =>
                node.id === selectedNode.id
                    ? { ...node, data: { ...node.data, [key]: value } }
                    : node
            ));
            setSelectedNode(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
        };

        return (
            <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
                <h3 className="font-semibold text-gray-700 mb-4">Properties</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Node Label
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.label}
                            onChange={(e) => updateNodeData('label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            value={selectedNode.data.content}
                            onChange={(e) => updateNodeData('content', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter your content here"
                        />
                    </div>
                </div>
            </div>
        );
    };

    // Export flow
    const exportFlow = () => {
        const flowData = {
            id: null,
            tenantId: "generated",
            name: flowName,
            created: null,
            flowNodes: nodes.map(node => ({
                id: node.id,
                flowNodeType: node.type === 'message' ? 'Message' :
                    node.type === 'question' ? 'Question' :
                        node.type === 'interactiveButtons' ? 'InteractiveButtons' : 'Condition',
                flowNodePosition: { posX: node.position.x.toString(), posY: node.position.y.toString() },
                isStartNode: node.isStartNode,
                ...(node.type === 'message' ? {
                    flowReplies: [{
                        flowReplyType: "Text",
                        data: node.data.content,
                        caption: "",
                        mimeType: ""
                    }]
                } : {}),
                ...(node.type === 'question' ? {
                    userInputVariable: node.data.variable,
                    answerValidation: { type: node.data.validation || "None" },
                    expectedAnswers: node.data.options.map(opt => ({
                        id: opt.id,
                        expectedInput: opt.text,
                        isDefault: false,
                        nodeResultId: opt.nodeResultId
                    }))
                } : {}),
                ...(node.type === 'interactiveButtons' ? {
                    interactiveButtonsUserInputVariable: "",
                    interactiveButtonsDefaultNodeResultId: ""
                } : {})
            })),
            flowEdges: connections,
            lastUpdated: new Date().toISOString(),
            isDeleted: false,
            transform: { posX: panOffset.x.toString(), posY: panOffset.y.toString(), zoom: zoom.toString() },
            isPro: false,
            channelTypes: ["WA"]
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
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={flowName}
                            onChange={(e) => setFlowName(e.target.value)}
                            className="text-xl font-semibold bg-transparent border-none outline-none"
                        />
                        <span className="text-sm text-gray-500">Automation Flow Builder</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Zoom Controls */}
                        <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
                            <button
                                onClick={handleZoomOut}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Zoom Out"
                            >
                                <ZoomOut size={16} />
                            </button>
                            <span className="text-xs px-2 min-w-[50px] text-center">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={handleZoomIn}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Zoom In"
                            >
                                <ZoomIn size={16} />
                            </button>
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <button
                                onClick={resetZoom}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Reset Zoom"
                            >
                                <RotateCcw size={16} />
                            </button>
                            <button
                                onClick={fitToView}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Fit to View"
                            >
                                <Home size={16} />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setConnectionMode(!connectionMode);
                                setConnectionStart(null);
                            }}
                            className={`px-3 py-2 border rounded-md flex items-center gap-2 transition-colors ${connectionMode
                                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                                    : 'text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <Zap size={16} />
                            {connectionMode ? 'Exit Connect' : 'Connect'}
                        </button>

                        <button
                            onClick={() => {
                                setNodes([]);
                                setConnections([]);
                                setSelectedNode(null);
                                setConnectionStart(null);
                                setConnectionMode(false);
                                setDraggingNode(null);
                                setNodeMenuOpen(null);
                            }}
                            className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md flex items-center gap-2 hover:border-gray-400 transition-colors"
                        >
                            <Trash2 size={16} />
                            Clear
                        </button>

                        <button
                            onClick={exportFlow}
                            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors"
                        >
                            <Download size={16} />
                            Export
                        </button>

                        <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors">
                            <Save size={16} />
                            Save
                        </button>

                        <button className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors">
                            <Play size={16} />
                            Test
                        </button>
                    </div>
                </div>

                {connectionMode && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm flex items-center gap-2">
                        <Zap size={16} className="text-green-600" />
                        <div>
                            <strong>Connection Mode:</strong> Click connection points to link nodes together.
                            {connectionStart && (
                                <div className="mt-1 text-green-700">
                                    <strong>Connecting from:</strong> Node {connectionStart.nodeId.split('-')[1]}
                                    {connectionStart.optionId && ` (Option)`}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                    <h3 className="font-semibold text-gray-700 mb-4">Components</h3>

                    <div className="space-y-2">
                        {nodeTypes.map((nodeType) => {
                            const Icon = nodeType.icon;
                            return (
                                <div
                                    key={nodeType.type}
                                    draggable
                                    onDragStart={(e) => {
                                        setDraggedNode(nodeType);
                                        setIsDragging(true);
                                    }}
                                    onDragEnd={() => setIsDragging(false)}
                                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab transition-all duration-200 hover:shadow-md hover:border-gray-300 active:scale-95"
                                >
                                    <div className={`${nodeType.color} p-2 rounded-lg text-white shadow-sm`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-800">{nodeType.label}</div>
                                        <div className="text-xs text-gray-500 leading-tight">{nodeType.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Canvas Info */}
                    <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-sm text-blue-800 mb-2">Canvas Controls</h4>
                        <div className="text-xs text-blue-700 space-y-1">
                            <div>• Drag components to canvas</div>
                            <div>• Scroll to zoom in/out</div>
                            <div>• Click & drag to pan</div>
                            <div>• Use ⋮ menu on nodes</div>
                        </div>
                    </div>
                </div>

                {/* Main Canvas */}
                <div
                    ref={canvasRef}
                    className="relative flex-1 bg-gray-100 overflow-hidden cursor-grab active:cursor-grabbing"
                    style={{
                        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
                    }}
                    onDrop={handleCanvasDrop}
                    onDragOver={handleDragOver}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onClick={() => {
                        setSelectedNode(null);
                        setNodeMenuOpen(null);
                    }}
                >
                    {/* Connection Lines (SVG) */}
                    {renderConnections()}

                    {/* Render Nodes */}
                    {nodes.map(node => (
                        <NodeComponent key={node.id} node={node} />
                    ))}

                    {/* Canvas Info Overlay */}
                    {nodes.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-gray-400">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">Start Building Your Flow</p>
                                <p className="text-sm">Drag components from the sidebar to begin</p>
                            </div>
                        </div>
                    )}

                    {/* Zoom indicator */}
                    <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600">
                        Zoom: {Math.round(zoom * 100)}%
                    </div>
                </div>

                {/* Properties Panel */}
                <PropertiesPanel />
            </div>
        </div>
    );
};

export default AutomationFlowBuilder;