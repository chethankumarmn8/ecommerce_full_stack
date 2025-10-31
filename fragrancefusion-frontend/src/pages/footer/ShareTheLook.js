import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaCamera, FaHashtag, FaTrophy, FaUpload, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled, { keyframes } from 'styled-components';
import { Lightbox } from 'react-modal-image';

const ShareTheLook = () => {
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [galleryItems, setGalleryItems] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        socialHandle: Yup.string(),
        productsUsed: Yup.string().required('Required'),
        styleName: Yup.string().required('Required'),
        inspiration: Yup.string(),
        file: Yup.mixed()
            .required('File is required')
            .test('fileSize', 'File too large (max 10MB)', value => value?.size <= 10485760)
            .test('fileType', 'Unsupported format', value =>
                ['image/jpeg', 'image/png', 'video/mp4'].includes(value?.type) // Corrected closing parenthesis
            )
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            socialHandle: '',
            productsUsed: '',
            styleName: '',
            inspiration: '',
            file: null
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== null) formData.append(key, value);
                });

                const response = await axios.post('/api/submissions', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.status === 201) {
                    setSubmissionStatus('success');
                    resetForm();
                    setGalleryItems(prev => [response.data, ...prev]);
                }
            } catch (error) {
                setSubmissionStatus('error');
            }
        }
    });

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data } = await axios.get('/api/submissions');
                setGalleryItems(data);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    const MediaThumbnail = ({ item }) => {
        const [isHovered, setIsHovered] = useState(false);
        const byteArray = new Uint8Array(item.fileData);
        const blob = new Blob([byteArray], { type: item.fileType });
        const mediaUrl = URL.createObjectURL(blob);

        return (
            <GalleryItem
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setSelectedMedia(mediaUrl)}
            >
                {item.fileType.startsWith('video') ? (
                    <video muted autoPlay={isHovered} loop>
                        <source src={mediaUrl} type={item.fileType} />
                    </video>
                ) : (
                    <img src={mediaUrl} alt={item.styleName} />
                )}
                <Caption className={isHovered ? 'visible' : ''}>
                    <h3>{item.styleName}</h3>
                    <p>By {item.name}</p>
                </Caption>
            </GalleryItem>
        );
    };

    return (
        <Container fluid className="px-lg-5">
            <HeroSection>
                <div className="hero-content">
                    <h1>
                        <FaCamera />
                        Share Your <span>VividHands</span> Creation
                    </h1>
                    <p>Join Our Style Community & Win Exclusive Prizes</p>
                </div>
            </HeroSection>

            <StepsContainer>
                <Row>
                    {[
                        { icon: <FaCamera />, title: 'Create', text: 'Showcase your unique style' },
                        { icon: <FaHashtag />, title: 'Share', text: 'Tag #VividHandsCommunity' },
                        { icon: <FaTrophy />, title: 'Win', text: 'Monthly featured prizes' }
                    ].map((step, i) => (
                        <Col key={i} md={4}>
                            <StepCard>
                                <div className="icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </StepCard>
                        </Col>
                    ))}
                </Row>
            </StepsContainer>

            <GallerySection>
                <h2>Featured Creations</h2>
                {isLoading ? (
                    <LoadingSpinner animation="border" />
                ) : (
                    <GalleryGrid>
                        {galleryItems.map(item => (
                            <MediaThumbnail key={item.id} item={item} />
                        ))}
                    </GalleryGrid>
                )}
            </GallerySection>

            <FormSection>
                <FormContainer>
                    <h2><FaUpload /> Submit Your Look</h2>

                    {submissionStatus === 'success' && (
                        <SuccessAlert>
                            <FaCheckCircle /> Submission successful!
                        </SuccessAlert>
                    )}

                    {submissionStatus === 'error' && (
                        <ErrorAlert>Error submitting. Please try again.</ErrorAlert>
                    )}

                    <StyledForm onSubmit={formik.handleSubmit}>
                        <FormRow>
                            <FormGroup>
                                <label>Full Name</label>
                                <input
                                    name="name"
                                    {...formik.getFieldProps('name')}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <FormError>{formik.errors.name}</FormError>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <label>Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <FormError>{formik.errors.email}</FormError>
                                )}
                            </FormGroup>
                        </FormRow>

                        <FormGroup>
                            <label>Social Media Handle</label>
                            <input
                                name="socialHandle"
                                {...formik.getFieldProps('socialHandle')}
                                placeholder="@username"
                            />
                            {formik.touched.socialHandle && formik.errors.socialHandle && (
                                <FormError>{formik.errors.socialHandle}</FormError>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <label>Products Used *</label>
                            <textarea
                                name="productsUsed"
                                {...formik.getFieldProps('productsUsed')}
                                placeholder="List products used (comma-separated)"
                            />
                            {formik.touched.productsUsed && formik.errors.productsUsed && (
                                <FormError>{formik.errors.productsUsed}</FormError>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <label>Style Name *</label>
                            <input
                                name="styleName"
                                {...formik.getFieldProps('styleName')}
                                placeholder="e.g., Midnight Glam"
                            />
                            {formik.touched.styleName && formik.errors.styleName && (
                                <FormError>{formik.errors.styleName}</FormError>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <label>Inspiration</label>
                            <textarea
                                name="inspiration"
                                {...formik.getFieldProps('inspiration')}
                                placeholder="What inspired your look?"
                            />
                            {formik.touched.inspiration && formik.errors.inspiration && (
                                <FormError>{formik.errors.inspiration}</FormError>
                            )}
                        </FormGroup>

                        <FileUpload>
                            <input
                                type="file"
                                name="file"
                                id="file-upload"
                                onChange={e => formik.setFieldValue('file', e.currentTarget.files[0])}
                            />
                            <UploadBox as="label" htmlFor="file-upload">
                                {formik.values.file ? (
                                    <Preview>
                                        {formik.values.file.type.startsWith('video') ? (
                                            <video src={URL.createObjectURL(formik.values.file)} />
                                        ) : (
                                            <img src={URL.createObjectURL(formik.values.file)} alt="Preview" />
                                        )}
                                    </Preview>
                                ) : (
                                    <>
                                        <FaUpload />
                                        <p>Drag & drop or click to upload</p>
                                    </>
                                )}
                            </UploadBox>
                            {formik.touched.file && formik.errors.file && (
                                <FormError>{formik.errors.file}</FormError>
                            )}
                        </FileUpload>

                        <SubmitButton type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? <Spinner size="sm" /> : 'Submit'}
                        </SubmitButton>
                    </StyledForm>
                </FormContainer>
            </FormSection>

            {selectedMedia && (
                <Lightbox
                    large={selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                    hideDownload
                    hideZoom
                />
            )}
        </Container>
    );
};

// Styled Components
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled.section`
    background: linear-gradient(135deg, #2a0a47 0%, #6c1b8f 100%);
    padding: 8rem 2rem;
    text-align: center;
    color: white;

    h1 {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        animation: ${fadeIn} 0.8s ease-out;

        svg {
            margin-right: 1rem;
        }

        span {
            color: #c5a47e;
        }
    }

    p {
        font-size: 1.5rem;
        opacity: 0.9;
    }
`;

const StepsContainer = styled.div`
    padding: 4rem 0;
    background: #f8f9fa;
`;

const StepCard = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    text-align: center;

    &:hover {
        transform: translateY(-10px);
    }

    .icon {
        font-size: 2.5rem;
        color: #6c1b8f;
        margin-bottom: 1rem;
    }

    h3 {
        color: #2a0a47;
        margin-bottom: 0.5rem;
    }

    p {
        color: #666;
    }
`;

const GallerySection = styled.section`
    padding: 4rem 0;

    h2 {
        text-align: center;
        margin-bottom: 3rem;
        color: #2a0a47;
    }
`;

const GalleryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 0 2rem;
`;

const GalleryItem = styled.div`
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 1;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.03);
    }

    video, img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Caption = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.visible {
        opacity: 1;
    }
`;

const FormSection = styled.section`
    padding: 4rem 0;
    background: #f8f9fa;
`;

const FormContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 3rem;
    border-radius: 1.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);

    h2 {
        text-align: center;
        margin-bottom: 2rem;
        color: #2a0a47;

        svg {
            margin-right: 1rem;
            color: #6c1b8f;
        }
    }
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
    }

    input, select, textarea {
        width: 100%;
        padding: 1rem;
        border: 2px solid #eee;
        border-radius: 0.5rem;
        transition: border-color 0.3s ease;

        &:focus {
            border-color: #6c1b8f;
            outline: none;
        }
    }
`;

const FileUpload = styled.div`
    input[type="file"] {
        display: none;
    }
`;

const UploadBox = styled.div`
    border: 2px dashed #ddd;
    border-radius: 1rem;
    padding: 3rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;

    &:hover {
        border-color: #6c1b8f;
        background: #f9f0ff;
    }

    svg {
        font-size: 2rem;
        color: #6c1b8f;
        margin-bottom: 1rem;
    }

    p {
        color: #666;
        margin: 0;
    }
`;

const Preview = styled.div`
    position: relative;
    padding-top: 100%;

    video, img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.5rem;
    }
`;

const SubmitButton = styled.button`
    background: linear-gradient(135deg, #6c1b8f 0%, #2a0a47 100%);
    color: white;
    padding: 1.2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const FormError = styled.div`
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
`;

const SuccessAlert = styled(Alert)`
    background: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const ErrorAlert = styled(Alert)`
    background: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
`;

const LoadingSpinner = styled(Spinner)`
    margin: 2rem auto;
    color: #6c1b8f;
`;

export default ShareTheLook;