// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { FiUser } from "react-icons/fi";
import artisanDashboardService from "../../services/artisanDashboardService";

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        category: "",
        experience: "",
        mobile: "",
        location: "",
        materialsUsed: "",
        certificatePath: ""
    });
    const [password, setPassword] = useState({ new: "", confirm: "" });
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await artisanDashboardService.getProfile();
                setProfile(response.data);
            } catch (err) {
                setError("Failed to load profile");
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("name", profile.name);
        formData.append("email", profile.email);
        formData.append("category", profile.category);
        formData.append("experience", profile.experience);
        formData.append("mobile", profile.mobile);
        formData.append("location", profile.location);
        formData.append("materialsUsed", profile.materialsUsed);

        if (certificate) formData.append("certificate", certificate);
        if (password.new) {
            formData.append("password", password.new);
            formData.append("confirmPassword", password.confirm);
        }

        try {
            const response = await artisanDashboardService.updateProfile(formData);
            setProfile(response.data);
            setSuccess("Profile updated successfully!");
            setCertificate(null);
            setPassword({ new: "", confirm: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0"><FiUser className="me-2" />Artisan Profile</h2>
                </div>

                <div className="card-body p-4">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Form.Group controlId="name">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        value={profile.name}
                                        onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group controlId="category">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={profile.category}
                                        onChange={(e) => setProfile(p => ({ ...p, category: e.target.value }))}
                                    >
                                        <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group controlId="experience">
                                    <Form.Label>Experience (Years)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={profile.experience}
                                        onChange={(e) => setProfile(p => ({ ...p, experience: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group controlId="mobile">
                                    <Form.Label>Mobile</Form.Label>
                                    <Form.Control
                                        value={profile.mobile}
                                        onChange={(e) => setProfile(p => ({ ...p, mobile: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-12">
                                <Form.Group controlId="location">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        value={profile.location}
                                        onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-12">
                                <Form.Group controlId="materials">
                                    <Form.Label>Materials & Techniques</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={profile.materialsUsed}
                                        onChange={(e) => setProfile(p => ({ ...p, materialsUsed: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-12">
                                <Form.Group controlId="certificate">
                                    <Form.Label>Update Certification</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setCertificate(e.target.files[0])}
                                        accept="application/pdf"
                                    />
                                    {profile.certificatePath && (
                                        <div className="mt-2 text-muted">
                                            Current file: {profile.certificatePath}
                                        </div>
                                    )}
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group controlId="newPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password.new}
                                        onChange={(e) => setPassword(p => ({ ...p, new: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group controlId="confirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password.confirm}
                                        onChange={(e) => setPassword(p => ({ ...p, confirm: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-12 mt-4">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;