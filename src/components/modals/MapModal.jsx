import { useSelector } from "react-redux";
import CommonModal from "../CommonModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet CSS

function MapModal({ ...otherProps }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  console.log(selectedRowData);

  return (
    <CommonModal {...otherProps} closeTopRight width={"600px"}>
      <div style={{ height: "500px", width: "100%", marginTop: "30px" }}> {/* Wrapper with fixed height */}
        <MapContainer
          center={[selectedRowData?.latitude, selectedRowData?.longitude]}
          zoom={30}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }} // Full size within wrapper
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedRowData?.latitude && selectedRowData?.longitude && (
            <Marker position={[selectedRowData.latitude, selectedRowData.longitude]}>
              <Popup>
                {selectedRowData?.description || "Location description here"}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </CommonModal>
  );
}

export default MapModal;
