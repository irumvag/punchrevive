# Implementation Plan

- [x] 1. Initialize Next.js project with core dependencies and configuration





  - Create Next.js 15 project with App Router and TypeScript
  - Install dependencies: Tailwind CSS, Framer Motion, Howler.js, Sharp, Tesseract.js, fast-check, Vitest
  - Configure Tailwind with haunted laboratory color palette (#000000, #0f0, #003300)
  - Set up IBM Plex Mono and Creepster fonts from Google Fonts
  - Create base layout with haunted laboratory background
  - Configure TypeScript strict mode and path aliases
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 2. Implement Kiro integration artifacts





  - [x] 2.1 Create steering documents for aesthetic and code standards


    - Write `.kiro/steering/haunted-aesthetic.md` with color palette, typography, and tone guidelines
    - Write `.kiro/steering/code-standards.md` with file organization and naming conventions
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [x] 2.2 Set up agent hooks configuration


    - Create `.kiro/hooks/pre-commit.yaml` for Curse Detector hook
    - Create `.kiro/hooks/post-upload.yaml` for resurrection pipeline hook
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [x] 2.3 Implement custom MCP extension for punch card operations


    - Create `.kiro/mcp/punch-card-mcp/` directory structure
    - Implement MCP server with ebcdic_decode, legacy_translate, and validate_punch_pattern tools
    - Create `.kiro/settings/mcp.json` configuration
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 3. Build core data models and TypeScript interfaces




  - [x] 3.1 Define TypeScript interfaces for all data models


    - Create `src/types/punch-card.types.ts` with PunchCard, DecodedSource, Translation, BugFix, ShareableResult interfaces
    - Create `src/types/api.types.ts` with API request/response types
    - Create `src/types/ui.types.ts` with component prop types
    - _Requirements: 3.3, 4.3, 5.3, 6.1_
  
  - [ ]* 3.2 Write property test for data model validation
    - **Property 6: OCR grid output format**
    - **Validates: Requirements 3.3**

- [x] 4. Implement EBCDIC decoder service





  - [x] 4.1 Create EBCDIC encoding maps and decoder logic


    - Implement `src/services/ebcdic.service.ts` with IBM 029 and IBM 026 character mappings
    - Create decode function that translates 12-bit punch patterns to characters
    - Implement auto-detection logic to try both encodings and score coherence
    - _Requirements: 4.1, 4.2, 4.4_
  

  - [x] 4.2 Implement language detection heuristics


    - Add keyword-based detection for FORTRAN, COBOL, Assembler, and BASIC
    - Implement scoring system for language confidence
    - _Requirements: 4.3_
  
  - [ ]* 4.3 Write property tests for EBCDIC decoding
    - **Property 9: EBCDIC decoding correctness**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ]* 4.4 Write property test for language detection
    - **Property 10: Language detection accuracy**
    - **Validates: Requirements 4.3**
  
  - [ ]* 4.5 Write property test for ambiguous pattern handling
    - **Property 11: Ambiguous pattern fallback**
    - **Validates: Requirements 4.4**

- [x] 5. Implement OCR service with hole detection





  - [x] 5.1 Create image pre-processing pipeline


    - Implement `src/services/ocr.service.ts` with Sharp-based image processing
    - Add grayscale conversion, adaptive thresholding, edge detection
    - Implement perspective correction for skewed cards
    - _Requirements: 3.2_
  
  - [x] 5.2 Implement punch hole detection algorithm

    - Create 12×80 grid overlay on processed image
    - Implement darkness threshold detection for each cell
    - Add morphological operations to clean noise
    - Calculate confidence score based on alignment and consistency
    - _Requirements: 3.1, 3.3_
  
  - [x] 5.3 Add confidence-based error handling

    - Implement confidence threshold check (95% for real cards, 100% for virtual)
    - Return appropriate error messages for low confidence
    - _Requirements: 3.4_
  
  - [ ]* 5.4 Write property test for OCR grid output
    - **Property 6: OCR grid output format**
    - **Validates: Requirements 3.3**
  
  - [ ]* 5.5 Write property test for OCR confidence error handling
    - **Property 7: OCR confidence error handling**
    - **Validates: Requirements 3.4**
  
  - [ ]* 5.6 Write property test for virtual card accuracy
    - **Property 8: Virtual card perfect accuracy**
    - **Validates: Requirements 3.5**

- [x] 6. Implement AI translation service





  - [x] 6.1 Create LLM integration with OpenAI and Claude


    - Implement `src/services/translation.service.ts` with OpenAI GPT-4o API client
    - Add Claude 3.5 as fallback provider
    - Create prompt templates for code translation
    - Implement response parsing and validation
    - _Requirements: 5.1, 5.2_
  
  - [x] 6.2 Implement bug detection and fixing logic



    - Add bug detection patterns for infinite loops, memory leaks, syntax errors, undefined variables, type mismatches
    - Create spooky message mapping (e.g., "Infinite loop demon banished")
    - Implement bug fix application in translated code
    - Generate Exorcism Report with all fixes
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 6.3 Write property test for translation syntax validity
    - **Property 12: Translation to modern languages**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  
  - [ ]* 6.4 Write property test for bug detection
    - **Property 13: Bug detection completeness**
    - **Validates: Requirements 6.1**
  
  - [ ]* 6.5 Write property test for bug fixing
    - **Property 14: Bug fixing application**
    - **Validates: Requirements 6.2**
  
  - [ ]* 6.6 Write property test for Exorcism Report generation
    - **Property 15: Exorcism Report generation**
    - **Validates: Requirements 6.3**
  
  - [ ]* 6.7 Write property test for spooky terminology
    - **Property 16: Spooky terminology usage**
    - **Validates: Requirements 6.4**

- [x] 7. Implement result storage service with Vercel KV






  - [x] 7.1 Create storage service for shareable results



    - Implement `src/services/storage.service.ts` with Vercel KV integration
    - Add saveResult function with UUID generation
    - Implement getResult function for retrieval
    - Set 30-day TTL for stored results
    - _Requirements: 10.1, 10.2_
  
  - [ ]* 7.2 Write property test for URL uniqueness
    - **Property 22: Shareable URL uniqueness**
    - **Validates: Requirements 10.1**
  
  - [ ]* 7.3 Write property test for shared result content
    - **Property 23: Shared result content completeness**
    - **Validates: Requirements 10.2**

- [x] 8. Build API routes for backend functionality





  - [x] 8.1 Create upload API endpoint


    - Implement `src/app/api/upload/route.ts` for image upload handling
    - Add file validation (format, size limits)
    - Store uploaded images temporarily
    - Return job ID for processing
    - _Requirements: 1.1, 1.3, 1.5_
  
  - [x] 8.2 Create processing status API endpoint


    - Implement `src/app/api/process/[jobId]/route.ts` for status polling
    - Return processing progress and results
    - Handle error states
    - _Requirements: 3.1, 4.1, 5.1_
  
  - [x] 8.3 Create translation API endpoint


    - Implement `src/app/api/translate/route.ts` for code translation
    - Integrate with translation service
    - Return translated code and bug fixes
    - _Requirements: 5.1, 6.1_
  
  - [x] 8.4 Create share API endpoint


    - Implement `src/app/api/share/[id]/route.ts` for retrieving shared results
    - Integrate with storage service
    - Track view counts
    - _Requirements: 10.1, 10.2_
  
  - [ ]* 8.5 Write property test for file format validation
    - **Property 1: File format validation**
    - **Validates: Requirements 1.3, 1.5**
-

- [x] 9. Checkpoint - Ensure all backend services and APIs are working



  - Ensure all tests pass, ask the user if questions arise.
-

- [x] 10. Build HauntedLayout component with theme



  - [x] 10.1 Create base layout component

    - Implement `src/components/HauntedLayout/HauntedLayout.tsx` with haunted laboratory background
    - Add cobwebs, dusty CRTs, scattered papers, and glowing vials as background elements
    - Apply global color palette and typography
    - Implement responsive layout container
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x] 10.2 Write property test for color palette consistency





    - **Property 17: Color palette consistency**
    - **Validates: Requirements 8.2**
  
  - [ ]* 10.3 Write property test for code font styling
    - **Property 18: Code font styling**
    - **Validates: Requirements 8.3**
  
  - [ ]* 10.4 Write property test for heading font styling
    - **Property 19: Heading font styling**
    - **Validates: Requirements 8.4**
  
  - [ ]* 10.5 Write property test for responsive theme preservation
    - **Property 20: Responsive theme preservation**
    - **Validates: Requirements 8.5**
-

- [x] 11. Build UploadZone component



  - [x] 11.1 Implement drag-and-drop upload functionality


    - Create `src/components/UploadZone/UploadZone.tsx` with React Dropzone
    - Add visual feedback for drag-over state
    - Implement file validation (PNG, JPEG, WEBP, max 10MB)
    - Display upload progress with spooky animations
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  
  - [x] 11.2 Add camera capture for mobile devices


    - Implement camera trigger using HTML5 input with capture attribute
    - Add device detection for mobile-specific UI
    - _Requirements: 1.4_
  
  - [ ]* 11.3 Write property test for drag feedback
    - **Property 2: Virtual Puncher toggle behavior** (adapted for drag state)
    - **Validates: Requirements 1.2**
-

- [x] 12. Build VirtualPuncher component




  - [x] 12.1 Create interactive punch card grid


    - Implement `src/components/VirtualPuncher/VirtualPuncher.tsx` with 80×12 grid
    - Use HTML5 Canvas or CSS Grid for rendering
    - Add click/touch handlers for toggling punch holes
    - Implement visual representation (filled circles for punched, empty for unpunched)
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 12.2 Add easter egg detection for "666" pattern


    - Implement pattern detection logic
    - Trigger red screen flash and exorcism chant audio
    - _Requirements: 2.5_
  
  - [x] 12.3 Implement card submission functionality


    - Export punch pattern as boolean array
    - Integrate with processing API
    - _Requirements: 2.4_
  
  - [ ]* 12.4 Write property test for toggle behavior
    - **Property 2: Virtual Puncher toggle behavior**
    - **Validates: Requirements 2.2**
  
  - [ ]* 12.5 Write property test for visual consistency
    - **Property 3: Virtual Puncher visual consistency**
    - **Validates: Requirements 2.3**

- [x] 13. Build CodeDisplay component





  - [x] 13.1 Create code display with syntax highlighting


    - Implement `src/components/CodeDisplay/CodeDisplay.tsx` with side-by-side layout
    - Add syntax highlighting for Python and JavaScript using Prism or Shiki
    - Use IBM Plex Mono font with #0f0 color
    - Add line numbers in retro style
    - Implement CRT flicker effect animation
    - _Requirements: 4.5, 5.1, 5.2, 8.3_

- [x] 14. Build ExorcismReport component




  - [x] 14.1 Create bug report display

    - Implement `src/components/ExorcismReport/ExorcismReport.tsx` with blood-drip styled list
    - Map bug types to spooky messages
    - Animate each fix reveal with ghost effect
    - Display "No demons detected - code is pure" when clean
    - _Requirements: 6.3, 6.4, 6.5_
-

- [x] 15. Build ResurrectionAnimation component




  - [x] 15.1 Create multi-stage animation sequence







    - Implement `src/components/ResurrectionAnimation/ResurrectionAnimation.tsx` with Framer Motion
    - Add lightning strike animation (0-1s)
    - Add card shaking animation (1-2s)
    - Add ectoplasm glow animation (2-3s)
    - Add code materialization animation (3-4s)
    - Integrate Howler.js for ghost moan sound effects
    - Add skip button for impatient users
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
-

- [x] 16. Build CertificateGenerator component



  - [x] 16.1 Create certificate with downloadable PNG


    - Implement `src/components/CertificateGenerator/CertificateGenerator.tsx`
    - Use Creepster font for blood-drip styling
    - Include original language, target language, and resurrection date
    - Add decorative horror elements (skulls, cobwebs)
    - Use html-to-image library for PNG generation
    - Trigger browser download
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 16.2 Write property test for certificate content
    - **Property 21: Certificate content completeness**
    - **Validates: Requirements 9.3**

- [x] 17. Build ShareButton component








  - [x] 17.1 Create social sharing functionality










    - Implement `src/components/ShareButton/ShareButton.tsx`
    - Generate unique shareable URLs
    - Create Twitter/X preview card with Open Graph tags
    - Add copy-to-clipboard with spooky confirmation
    - Display share options (Twitter, Facebook, LinkedIn, Copy)
    - _Requirements: 10.1, 10.3, 10.4_


- [x] 18. Build main page with complete resurrection flow




  - [x] 18.1 Create home page with upload and virtual puncher


    - Implement `src/app/page.tsx` with HauntedLayout
    - Integrate UploadZone and VirtualPuncher components
    - Add tab/toggle to switch between upload and virtual modes
    - _Requirements: 1.1, 2.1_
  
  - [x] 18.2 Create results page with code display and animations


    - Implement `src/app/results/[jobId]/page.tsx`
    - Integrate ResurrectionAnimation, CodeDisplay, ExorcismReport components
    - Add CertificateGenerator and ShareButton
    - _Requirements: 7.1, 9.1, 10.1_
  
  - [x] 18.3 Create shared result page


    - Implement `src/app/share/[id]/page.tsx`
    - Display punch card, translated code, and Exorcism Report
    - Add Open Graph meta tags for social preview
    - _Requirements: 10.2, 10.3, 10.4_

- [x] 19. Implement responsive design for all viewports










  - [x] 19.1 Add responsive breakpoints and mobile optimizations

















    - Configure Tailwind breakpoints (mobile ≤768px, tablet 769-1024px, desktop >1024px)
    - Optimize layouts for each breakpoint
    - Ensure Virtual Puncher is touch-friendly on mobile
    - Test all interactive elements for 44×44px minimum touch targets
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_
  
  - [x] 19.2 Write property test for responsive layout






    - **Property 25: Responsive layout adaptation**
    - **Validates: Requirements 16.1, 16.2, 16.3**
  
  - [x] 19.3 Write property test for touch target sizes




    - **Property 26: Touch target minimum size**
    - **Validates: Requirements 16.4, 16.5**
  
  - [x] 19.4 Write property test for shared result mobile responsiveness




    - **Property 24: Shared result mobile responsiveness**
    - **Validates: Requirements 10.5**


- [x] 20. Checkpoint - Ensure all frontend components render correctly



  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Configure Vercel deployment





  - [x] 21.1 Set up Vercel project and environment variables


    - Create `vercel.json` with build configuration
    - Configure environment variables (OPENAI_API_KEY, CLAUDE_API_KEY, KV credentials)
    - Set up Vercel KV database
    - Configure regions and function timeouts
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [x] 21.2 Create GitHub Actions workflow for CI/CD


    - Implement `.github/workflows/deploy.yml`
    - Add test and build steps
    - Configure Vercel deployment action
    - _Requirements: 17.5_


- [x] 22. Create comprehensive README with Kiro showcase



  - [x] 22.1 Write README with project overview and setup instructions





    - Document project purpose and features
    - Add installation and development instructions
    - Include deployment guide
    - _Requirements: 18.4, 18.5_
  -

  - [x] 22.2 Add "How Kiro Made This Possible" section




    - Document spec-driven development process
    - Explain agent hooks usage and benefits
    - Describe steering documents and their impact
    - Detail custom MCP extension functionality
    - Create comparison table: vibe-coding vs spec-driven vs hooks (with quantified time savings)
    - _Requirements: 11.4, 11.5, 15.1, 15.2, 15.3, 15.4, 15.5, 18.5_

- [x] 23. Ensure .kiro directory is visible in repository



  - [x] 23.1 Configure Git to include .kiro directory




    - Verify .gitignore does NOT exclude .kiro directory
    - Commit all spec documents, hooks, steering files, and MCP configurations
    - Add README in .kiro directory explaining structure
    - _Requirements: 18.1, 18.2, 18.3_

- [x] 24. Create demo video and final polish




  - [x] 24.1 Record 3-minute demo video



    - Show real punch card photo upload → resurrection
    - Demonstrate Virtual Puncher in action
    - Showcase Kiro spec → code generation → hooks running
    - Highlight spooky UI, sounds, and certificate
    - _Requirements: All requirements (demo showcase)_
  
  - [x] 24.2 Final testing and bug fixes



    - Test complete user flows on multiple devices
    - Verify all animations and sounds work
    - Check responsive design on real mobile devices
    - Validate all shareable links work correctly
    - _Requirements: All requirements_

- [x] 25. Final Checkpoint - Complete end-to-end testing




  - Ensure all tests pass, ask the user if questions arise.
