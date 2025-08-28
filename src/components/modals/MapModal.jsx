import { useSelector } from "react-redux";
import CommonModal from "../CommonModal";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet CSS

const { BaseLayer } = LayersControl;

function MapModal({ ...otherProps }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  console.log(selectedRowData);

  return (
    <CommonModal {...otherProps} closeTopRight width={"600px"}>
      <div style={{ height: "500px", width: "100%", marginTop: "30px" }}>
        {/* Wrapper with fixed height */}
        <MapContainer
          center={[selectedRowData?.latitude, selectedRowData?.longitude]}
          zoom={30}  // Adjusted zoom level for better view
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }} // Full size within wrapper
        >
          {/* Layers Control */}
          <LayersControl position="topright">
            {/* OpenStreetMap Layer */}
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </BaseLayer>

            {/* Satellite Layer (Esri) */}
            <BaseLayer name="Satellite">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </BaseLayer>
          </LayersControl>

          {/* Marker with Popup */}
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
