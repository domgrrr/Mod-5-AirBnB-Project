import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSingleSpotFunction, updateSpot } from '../../store/spotsReducer';
import './UpdateSpotForm.css';

const UpdateSpotForm = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    description: '',
    name: '',
    price: '',
    previewImage: '',
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const { spot } = await dispatch(fetchSingleSpotFunction(spotId));
        setFormData({
          country: spot.country || '',
          address: spot.address || '',
          city: spot.city || '',
          state: spot.state || '',
          latitude: spot.lat || '',
          longitude: spot.lng || '',
          description: spot.description || '',
          name: spot.name || '',
          price: spot.price || '',
          previewImage: spot.SpotImages?.find(img => img.preview)?.url || '',
          image1: spot.SpotImages?.filter(img => !img.preview)[0]?.url || '',
          image2: spot.SpotImages?.filter(img => !img.preview)[1]?.url || '',
          image3: spot.SpotImages?.filter(img => !img.preview)[2]?.url || '',
          image4: spot.SpotImages?.filter(img => !img.preview)[3]?.url || ''
        });
      } catch (error) {
        console.error('Error loading spot:', error);
        navigate('/spots/current');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotData();
  }, [dispatch, spotId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const updatedSpot = await dispatch(updateSpot(spotId, formData));
        navigate(`/spots/${updatedSpot.id}`);
      } catch (err) {
        setErrors(err.errors || { form: 'An error occurred. Please try again.' });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (formData.description.length < 30) newErrors.description = "Description needs 30 or more characters";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const remainingChars = 30 - formData.description.length;
  const getCharacterCountText = () => {
    if (remainingChars > 0) {
      return `${remainingChars} more characters needed`;
    }
    return `${formData.description.length} characters (minimum reached)`;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="update-spot-form-container">
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit}>
        {errors.form && <p className="error">{errors.form}</p>}
        
        <section>
          <h2>Where is your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
          {errors.country && <p className="error">{errors.country}</p>}
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
          {errors.address && <p className="error">{errors.address}</p>}
          <div className="location-inputs">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
          {errors.city && <p className="error">{errors.city}</p>}
          {errors.state && <p className="error">{errors.state}</p>}
          <div className="location-inputs">
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Latitude"
            />
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Longitude"
            />
            <span className="optional-label">(Optional)</span>
          </div>
        </section>

        <section>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please write at least 30 characters"
          />
          <p className={`char-count ${remainingChars > 0 ? 'warning' : 'success'}`}>
            {getCharacterCountText()}
          </p>
          {errors.description && <p className="error">{errors.description}</p>}
        </section>

        <section>
          <h2>Create a title for your spot</h2>
          <p>Catch attention with a spot title that highlights what makes your place special.</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of your spot"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </section>

        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price per night (USD)"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </section>

        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            type="text"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
            placeholder="Preview Image URL"
          />
          {errors.previewImage && <p className="error">{errors.previewImage}</p>}
          <input
            type="text"
            name="image1"
            value={formData.image1}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <input
            type="text"
            name="image2"
            value={formData.image2}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <input
            type="text"
            name="image3"
            value={formData.image3}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <input
            type="text"
            name="image4"
            value={formData.image4}
            onChange={handleChange}
            placeholder="Image URL"
          />
        </section>

        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpotForm;