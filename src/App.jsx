import { useState, useRef } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import FileUpload from './components/FileUpload';
import AlgorithmInput from './components/AlgorithmInput';
import ChatInterface from './components/ChatInterface';
import ChatInput from './components/ChatInput';
import CodeEditor from './components/CodeEditor';
import SchemaViewer from './components/SchemaViewer';
import { analyzeCode, sendTeachMessage, sendMathMessage, sendTechnicalMessage, generateSchema } from './utils/apiClientDev';

function App() {
  // Mode state
  const [mode, setMode] = useState('select'); // 'select' | 'analyze' | 'learn' | 'math' | 'technical'

  // Shared state
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent race conditions with concurrent API calls
  const isProcessingRef = useRef(false);

  // Analyze mode state
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Learn mode state
  const [algorithmTopic, setAlgorithmTopic] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentSchema, setCurrentSchema] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [skeletonCode, setSkeletonCode] = useState('');

  // Handle mode selection
  const handleModeSelect = (selectedMode) => {
    // Reset all state
    setMessages([]);
    setIsLoading(false);
    setCurrentCode('');
    setCurrentLanguage('javascript');
    setUploadedFile(null);
    setAlgorithmTopic('');
    setConversationHistory([]);
    setCurrentSchema(null);
    setShowCodeEditor(false);
    setSkeletonCode('');

    // Set the new mode
    setMode(selectedMode);

    // Add welcome message based on mode
    if (selectedMode === 'analyze') {
      setMessages([
        {
          role: 'tutor',
          content: 'Welcome to Code Analysis! Upload a file to get started. I\'ll review your code based on production-ready principles like naming conventions, function size, error handling, and more.',
          type: 'text'
        }
      ]);
    } else if (selectedMode === 'learn') {
      setMessages([
        {
          role: 'tutor',
          content: 'Welcome to Algorithm Learning! Tell me what algorithm you\'d like to learn, and I\'ll guide you through it using intuitive explanations, visual diagrams, and hands-on practice.',
          type: 'text'
        }
      ]);
    } else if (selectedMode === 'math') {
      setMessages([
        {
          role: 'tutor',
          content: 'Welcome to Math Concepts! Ask me about probability, statistics, or game theory questions. I\'ll provide intuitive explanations, mathematical breakdowns, visual diagrams, and Python simulations.',
          type: 'text'
        }
      ]);
    } else if (selectedMode === 'technical') {
      setMessages([
        {
          role: 'tutor',
          content: 'Welcome to Technical Concepts! Ask me about system design, databases, networking, operating systems, cloud computing, or any technical concept. I\'ll explain it clearly with diagrams and real-world examples.',
          type: 'text'
        }
      ]);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file, content, language) => {
    setUploadedFile(file);
    setCurrentCode(content);
    setCurrentLanguage(language);

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        role: 'student',
        content: `Uploaded ${file.name}`,
        type: 'text'
      }
    ]);

    // Automatically trigger analysis
    await handleCodeAnalysis(content, language);
  };

  // Handle code analysis
  const handleCodeAnalysis = async (code = currentCode, language = currentLanguage) => {
    // Prevent concurrent analysis requests
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setIsLoading(true);

    try {
      const response = await analyzeCode(code, language);

      // Add single analysis message with all results
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          content: 'Analysis complete! Here are the results:',
          type: 'analysis',
          data: response
        }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          content: `Error analyzing code: ${error.message}. Please try again.`,
          type: 'text'
        }
      ]);
    } finally {
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  };

  // Handle code resubmission after editing
  const handleCodeResubmit = async () => {
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        role: 'student',
        content: 'Resubmitted code',
        type: 'text'
      }
    ]);

    // Analyze the updated code
    await handleCodeAnalysis();
  };

  // Unified code submission handler
  const handleCodeSubmit = async () => {
    if (!currentCode.trim()) return;

    if (mode === 'learn') {
      // Learning mode: send code to tutor for review
      // Add student's code submission to chat
      setMessages(prev => [
        ...prev,
        {
          role: 'student',
          content: 'Here\'s my implementation:',
          type: 'code',
          data: { code: currentCode }
        }
      ]);

      // Request code review from tutor with detailed instructions
      await handleTeachMessage(
        `I've implemented the code. Please review my solution carefully and provide specific feedback. Here's my implementation:\n\n\`\`\`${currentLanguage}\n${currentCode}\n\`\`\`\n\nPlease check if it's correct, point out any issues, and guide me if something is wrong.`,
        true // isCodeSubmission flag
      );
    } else if (mode === 'analyze') {
      // Analyze mode: perform code analysis
      await handleCodeResubmit();
    }
  };

  // Handle algorithm topic submission
  const handleAlgorithmSubmit = async (topic) => {
    setAlgorithmTopic(topic);

    // Default to Python for learning if no language set
    if (!currentLanguage || currentLanguage === 'javascript') {
      setCurrentLanguage('python');
    }

    // Start teaching conversation
    // handleTeachMessage will add the user message to chat
    const userMessage = `Teach me ${topic}`;
    await handleTeachMessage(userMessage);
  };

  // Handle teaching conversation
  const handleTeachMessage = async (userMessage, isCodeSubmission = false) => {
    // Prevent concurrent teaching requests
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setIsLoading(true);

    // Add user message to chat (unless it's a code submission, which is already added)
    if (!isCodeSubmission) {
      setMessages(prev => [
        ...prev,
        {
          role: 'student',
          content: userMessage,
          type: 'text'
        }
      ]);
    }

    try {
      // Select appropriate API function based on mode
      let response;
      if (mode === 'math') {
        response = await sendMathMessage(
          userMessage,
          conversationHistory,
          { algorithmTopic }
        );
      } else if (mode === 'technical') {
        response = await sendTechnicalMessage(
          userMessage,
          conversationHistory,
          { algorithmTopic }
        );
      } else {
        // Default to learn mode
        response = await sendTeachMessage(
          userMessage,
          conversationHistory,
          { algorithmTopic, currentLanguage }
        );
      }

      // Add tutor message
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          content: response.message,
          type: 'text'
        }
      ]);

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response.message }
      ]);

      // Handle schema generation if needed - add as embedded message
      if (response.needs_schema && response.schema_request) {
        const schemaData = await generateSchema(response.schema_request, algorithmTopic);

        setMessages(prev => [
          ...prev,
          {
            role: 'tutor',
            content: '',
            type: 'schema',
            data: schemaData
          }
        ]);
      }

      // Handle code skeleton if provided - always populate side editor (never inline)
      if (response.code_skeleton) {
        const skeleton = response.code_skeleton;

        // Detect language from skeleton code
        let detectedLang = currentLanguage;
        if (skeleton.includes('def ') || skeleton.includes('import ')) {
          detectedLang = 'python';
        } else if (skeleton.includes('function ') || skeleton.includes('const ') || skeleton.includes('let ')) {
          detectedLang = 'javascript';
        } else if (skeleton.includes('public class') || skeleton.includes('public static void')) {
          detectedLang = 'java';
        } else if (skeleton.includes('#include') || skeleton.includes('int main')) {
          detectedLang = 'cpp';
        }

        setCurrentLanguage(detectedLang);
        setSkeletonCode(skeleton);
        setCurrentCode(skeleton);
        setShowCodeEditor(true);
        // Note: Code appears in side editor ONLY, never inline in chat
      }

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          content: `Error: ${error.message}. Please try again.`,
          type: 'text'
        }
      ]);
    } finally {
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  };

  // Handle schema/diagram generation
  const handleSchemaGeneration = async (request, context = algorithmTopic) => {
    // Note: Schema generation can run concurrently with teaching since it's a sub-request
    // But we still need to track its loading state
    setIsLoading(true);

    try {
      const response = await generateSchema(request, context);

      setCurrentSchema(response);

      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          content: 'Here\'s a visual representation to help you understand:',
          type: 'schema',
          data: response
        }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          content: `Failed to generate diagram: ${error.message}`,
          type: 'text'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to mode selection
  const handleBackToModeSelect = () => {
    const hasWork = messages.length > 1 || currentCode || uploadedFile || algorithmTopic;

    if (hasWork) {
      const confirmed = window.confirm(
        'Are you sure you want to go back? Your current progress will be lost.'
      );
      if (!confirmed) return;
    }

    handleModeSelect('select');
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <Header
        onBack={handleBackToModeSelect}
        showBackButton={mode !== 'select'}
      />

      <main className="max-w-reading mx-auto py-8 sm:py-10 md:py-12 px-6 sm:px-8">
        {mode === 'select' && (
          <div className="mode-transition">
            <ModeSelector onSelectMode={handleModeSelect} />
          </div>
        )}

        {mode === 'analyze' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 mode-transition">
            <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isLoading} />

            {uploadedFile && (
              <>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-textPrimary mb-3 md:mb-4">
                    Code Review
                  </h2>
                  <CodeEditor
                    value={currentCode}
                    onChange={setCurrentCode}
                    language={currentLanguage}
                    readOnly={false}
                    onSubmit={handleCodeResubmit}
                    isSubmitting={isLoading}
                  />
                </div>

                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-textPrimary mb-3 md:mb-4">
                    Analysis Results
                  </h2>
                  <ChatInterface messages={messages} loading={isLoading} />
                </div>
              </>
            )}
          </div>
        )}

        {mode === 'learn' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 mode-transition">
            {!algorithmTopic ? (
              <AlgorithmInput
                onSubmit={handleAlgorithmSubmit}
                isLoading={isLoading}
                mode="algorithms"
              />
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-textPrimary">
                    Learning: {algorithmTopic}
                  </h2>
                  <button
                    onClick={() => {
                      setAlgorithmTopic('');
                      setMessages([]);
                      setConversationHistory([]);
                      setCurrentSchema(null);
                      setShowCodeEditor(false);
                      setSkeletonCode('');
                      setCurrentCode('');
                    }}
                    className="text-textSecondary hover:text-textPrimary text-sm underline transition-colors self-start sm:self-auto"
                  >
                    Choose different topic
                  </button>
                </div>

                {/* Side-by-side layout: Chat left, Code editor right */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Left column: Chat Interface */}
                  <div className={`flex-1 ${showCodeEditor ? 'lg:w-3/5' : 'w-full'}`}>
                    <div className="space-y-4">
                      <ChatInterface messages={messages} loading={isLoading} />
                      <ChatInput onSubmit={handleTeachMessage} isLoading={isLoading} />
                    </div>
                  </div>

                  {/* Right column: Code Editor (conditional) */}
                  {showCodeEditor && (
                    <div className="lg:w-2/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-textPrimary">
                          Practice Implementation
                        </h3>
                      </div>
                      <CodeEditor
                        value={currentCode}
                        onChange={setCurrentCode}
                        language={currentLanguage}
                        readOnly={false}
                        onSubmit={handleCodeSubmit}
                        isSubmitting={isLoading}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {mode === 'math' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 mode-transition">
            {!algorithmTopic ? (
              <AlgorithmInput
                onSubmit={handleAlgorithmSubmit}
                isLoading={isLoading}
                mode="math"
              />
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-textPrimary">
                    {algorithmTopic}
                  </h2>
                  <button
                    onClick={() => {
                      setAlgorithmTopic('');
                      setMessages([]);
                      setConversationHistory([]);
                      setCurrentSchema(null);
                      setShowCodeEditor(false);
                      setSkeletonCode('');
                      setCurrentCode('');
                    }}
                    className="text-textSecondary hover:text-textPrimary text-sm underline transition-colors self-start sm:self-auto"
                  >
                    Ask different question
                  </button>
                </div>

                {/* Side-by-side layout: Chat left, Code editor right (when code provided) */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Left column: Chat Interface */}
                  <div className={`flex-1 ${showCodeEditor ? 'lg:w-3/5' : 'w-full'}`}>
                    <div className="space-y-4">
                      <ChatInterface messages={messages} loading={isLoading} />
                      <ChatInput onSubmit={handleTeachMessage} isLoading={isLoading} />
                    </div>
                  </div>

                  {/* Right column: Code Editor (conditional) */}
                  {showCodeEditor && (
                    <div className="lg:w-2/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-textPrimary">
                          Python Simulation
                        </h3>
                      </div>
                      <CodeEditor
                        value={currentCode}
                        onChange={setCurrentCode}
                        language="python"
                        readOnly={false}
                        onSubmit={handleCodeSubmit}
                        isSubmitting={isLoading}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {mode === 'technical' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 mode-transition">
            {!algorithmTopic ? (
              <AlgorithmInput
                onSubmit={handleAlgorithmSubmit}
                isLoading={isLoading}
                mode="technical"
              />
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-textPrimary">
                    {algorithmTopic}
                  </h2>
                  <button
                    onClick={() => {
                      setAlgorithmTopic('');
                      setMessages([]);
                      setConversationHistory([]);
                      setCurrentSchema(null);
                      setShowCodeEditor(false);
                      setSkeletonCode('');
                      setCurrentCode('');
                    }}
                    className="text-textSecondary hover:text-textPrimary text-sm underline transition-colors self-start sm:self-auto"
                  >
                    Ask different question
                  </button>
                </div>

                {/* Side-by-side layout: Chat left, Code editor right (when code provided) */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Left column: Chat Interface */}
                  <div className={`flex-1 ${showCodeEditor ? 'lg:w-3/5' : 'w-full'}`}>
                    <div className="space-y-4">
                      <ChatInterface messages={messages} loading={isLoading} />
                      <ChatInput onSubmit={handleTeachMessage} isLoading={isLoading} />
                    </div>
                  </div>

                  {/* Right column: Code Editor (conditional) */}
                  {showCodeEditor && (
                    <div className="lg:w-2/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-textPrimary">
                          Code Implementation
                        </h3>
                      </div>
                      <CodeEditor
                        value={currentCode}
                        onChange={setCurrentCode}
                        language={currentLanguage}
                        readOnly={false}
                        onSubmit={handleCodeSubmit}
                        isSubmitting={isLoading}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
