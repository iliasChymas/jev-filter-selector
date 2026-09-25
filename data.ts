export enum Category {
  WIFI_TYPE = "wifi_type",
  BLUETOOTH = "bluetooth",
  ESIM = "esim",
  FEATURE_3GPP = "feature_3gpp",
  NETWORK_TECHNOLOGIES = "network_technologies",
  USE_CASES = "use_cases",
  FORM_FACTORS = "form_factors",
  VERTICALS = "verticals",
  DEVICE_TYPES = "device_types",
}

export type CategoryValue = Readonly<{
  id: number;
  name: string;
}>;

export type CategoryDetails = Readonly<{
  description: string;
  examples: readonly string[];
}>;

export const categoryDetails: Record<Category, CategoryDetails> = {
  [Category.WIFI_TYPE]: {
    description: "a required Wi-Fi capability or IEEE Wi-Fi generation",
    examples: ["WiFi supported", "WiFi 4", "WiFi 6", "WiFi 6E", "WiFi 7"],
  },
  [Category.BLUETOOTH]: {
    description: "a required Bluetooth capability or Bluetooth version",
    examples: ["Bluetooth supported", "Bluetooth 4.2", "Bluetooth 5.3", "Bluetooth LE"],
  },
  [Category.ESIM]: {
    description: "eSIM support or a required eSIM specification/profile",
    examples: ["eSIM supported", "M2M SGP.02", "Consumer SGP.22", "IoT SGP.32"],
  },
  [Category.FEATURE_3GPP]: {
    description: "a required 3GPP standards release",
    examples: ["Release 14", "Release 17", "3GPP Release 18", "Release 19"],
  },
  [Category.NETWORK_TECHNOLOGIES]: {
    description: "a required cellular network or voice-over-network technology",
    examples: ["LTE-M", "NB-IoT", "5G SA", "5G RedCap", "VoLTE", "VoWi-Fi"],
  },
  [Category.USE_CASES]: {
    description: "the activity, function, or application the product will perform",
    examples: ["monitoring", "cold chain", "video surveillance", "industrial automation", "rail maintenance"],
  },
  [Category.FORM_FACTORS]: {
    description: "the product's physical format, packaging, or consumer-device shape",
    examples: ["LGA", "M.2", "miniPCIe", "smartphone", "tablet", "integrated device"],
  },
  [Category.VERTICALS]: {
    description: "the industry or market sector where the product will be deployed",
    examples: ["healthcare", "agriculture", "manufacturing", "railway", "public safety", "oil and gas"],
  },
  [Category.DEVICE_TYPES]: {
    description: "the functional class of hardware being requested",
    examples: ["module", "development kit", "gateway", "sensor", "tracker", "camera", "robotics"],
  },
};

export const fieldAliases: Partial<
  Record<Category, Readonly<Record<number, readonly string[]>>>
> = {
  [Category.ESIM]: {
    2: ["M2M eSIM", "SGP.02"],
    3: ["consumer eSIM", "SGP.22"],
    4: ["IoT eSIM", "SGP.32"],
  },
  [Category.NETWORK_TECHNOLOGIES]: {
    12: ["non-standalone 5G", "5G non-standalone"],
    14: ["standalone 5G", "5G standalone"],
    18: ["NR-Lite", "RedCap"],
  },
  [Category.USE_CASES]: {
    18: ["temperature-controlled logistics", "refrigerated supply chain"],
    25: ["factory automation"],
    50: ["rail maintenance", "railway infrastructure maintenance"],
    51: ["Class 1 Division 1", "Cl1 Div.1", "hazardous-area certification"],
  },
  [Category.FORM_FACTORS]: {
    6: ["embedded device", "self-contained device"],
    7: ["mobile phone", "cell phone"],
    10: ["tablet computer"],
  },
  [Category.VERTICALS]: {
    1: ["healthcare sector", "medical sector"],
    8: ["oil and gas"],
    10: ["logistics sector", "transportation sector"],
    25: ["emergency services", "first responders"],
  },
  [Category.DEVICE_TYPES]: {
    1: ["cellular module", "modem module", "chipset"],
    10: ["dev kit", "evaluation kit"],
    12: ["autonomous vehicle", "AGV", "drone"],
    13: ["camera", "scanner"],
    14: ["sensor", "actuator"],
    15: ["tracking device", "asset tracker"],
    18: ["vehicle-mounted unit", "in-vehicle unit"],
  },
};

export const wifiType = [
    {
        "id": 1,
        "name": "Supported"
    },
    {
        "id": 2,
        "name": "WiFi 4 (802.11n)"
    },
    {
        "id": 3,
        "name": "WiFi 5 (802.11ac)"
    },
    {
        "id": 4,
        "name": "WiFi 6 (802.11ax)"
    },
    {
        "id": 5,
        "name": "WiFi 7 (802.11be)"
    },
    {
        "id": 6,
        "name": "WiFi 6E (802.11ax)"
    }
]

export const bluetooth = [
    {
        "id": 1,
        "name": "Supported"
    },
    {
        "id": 2,
        "name": "5"
    },
    {
        "id": 3,
        "name": "4.0"
    },
    {
        "id": 4,
        "name": "4.2"
    },
    {
        "id": 5,
        "name": "5.1"
    },
    {
        "id": 6,
        "name": "4.1"
    },
    {
        "id": 7,
        "name": "3.0+ HS"
    },
    {
        "id": 8,
        "name": "5.2"
    },
    {
        "id": 9,
        "name": "5.4"
    },
    {
        "id": 10,
        "name": "5.3"
    },
    {
        "id": 11,
        "name": "6.0"
    },
    {
        "id": 12,
        "name": "LE 4.0"
    },
    {
        "id": 16,
        "name": "LE 4.1"
    },
    {
        "id": 17,
        "name": "LE 4.2"
    },
    {
        "id": 24,
        "name": "LE 5.0"
    },
    {
        "id": 28,
        "name": "LE 5.1"
    },
    {
        "id": 31,
        "name": "LE 5.2"
    },
    {
        "id": 32,
        "name": "LE 5.3"
    }
]

export const esim = [
    {
        "id": 1,
        "name": "Supported"
    },
    {
        "id": 2,
        "name": "M2M (SGP.02)"
    },
    {
        "id": 3,
        "name": "Consumer (SGP.22)"
    },
    {
        "id": 4,
        "name": "IoT (SGP.32)"
    }
]

export const feature3gpp = [
    {
        "id": 1,
        "name": "Release 15"
    },
    {
        "id": 2,
        "name": "Release 16"
    },
    {
        "id": 3,
        "name": "Release 18"
    },
    {
        "id": 4,
        "name": "Release 19"
    },
    {
        "id": 6,
        "name": "Release 17"
    },
    {
        "id": 7,
        "name": "Release 14"
    }
]

export const networkTechnologies = [
    {
        "id": 4,
        "name": "LTE-M"
    },
    {
        "id": 5,
        "name": "LTE"
    },
    {
        "id": 6,
        "name": "LTE-Advanced"
    },
    {
        "id": 8,
        "name": "VoLTE"
    },
    {
        "id": 9,
        "name": "VoWi-Fi"
    },
    {
        "id": 10,
        "name": "NB-IoT"
    },
    {
        "id": 12,
        "name": "5G NSA"
    },
    {
        "id": 13,
        "name": "2G (GSM, GPRS, EDGE)"
    },
    {
        "id": 14,
        "name": "5G SA"
    },
    {
        "id": 16,
        "name": "3G (UMTS, HSPA)"
    },
    {
        "id": 18,
        "name": "5G RedCap (NR-Lite)"
    },
    {
        "id": 21,
        "name": "LTE-Advanced Pro"
    },
    {
        "id": 22,
        "name": "VoNR"
    }
]

export const useCases = [
    {
        "id": 1,
        "name": "Real-Time Data"
    },
    {
        "id": 2,
        "name": "Expanded Industrial IoT"
    },
    {
        "id": 3,
        "name": "Autonomous Vehicles"
    },
    {
        "id": 4,
        "name": "Smart City Applications"
    },
    {
        "id": 5,
        "name": "Smart Buildings"
    },
    {
        "id": 6,
        "name": "Healthcare"
    },
    {
        "id": 11,
        "name": "Retail"
    },
    {
        "id": 12,
        "name": "Utilities"
    },
    {
        "id": 13,
        "name": "Security"
    },
    {
        "id": 14,
        "name": "Positioning and Tracking"
    },
    {
        "id": 16,
        "name": "Telematics"
    },
    {
        "id": 17,
        "name": "Fleet management"
    },
    {
        "id": 18,
        "name": "Cold Chain"
    },
    {
        "id": 19,
        "name": "Fixed Wireless Access (FWA)"
    },
    {
        "id": 20,
        "name": "Railway"
    },
    {
        "id": 21,
        "name": "Monitoring"
    },
    {
        "id": 22,
        "name": "Maintenance"
    },
    {
        "id": 23,
        "name": "Remote operation"
    },
    {
        "id": 24,
        "name": "Worker Safety"
    },
    {
        "id": 25,
        "name": "Industrial automation"
    },
    {
        "id": 26,
        "name": "Computer Vision"
    },
    {
        "id": 27,
        "name": "Quality assurance & inspection"
    },
    {
        "id": 28,
        "name": "Video Surveillance"
    },
    {
        "id": 29,
        "name": "Material handling"
    },
    {
        "id": 30,
        "name": "Logistic"
    },
    {
        "id": 31,
        "name": "Augmented workforce"
    },
    {
        "id": 32,
        "name": "Other"
    },
    {
        "id": 33,
        "name": "Trackside"
    },
    {
        "id": 34,
        "name": "Venues"
    },
    {
        "id": 35,
        "name": "Media"
    },
    {
        "id": 36,
        "name": "5G Livestreaming"
    },
    {
        "id": 37,
        "name": "Physical security and access control"
    },
    {
        "id": 38,
        "name": "Secure communications"
    },
    {
        "id": 39,
        "name": "Emergency alarm via distress button"
    },
    {
        "id": 40,
        "name": "Video streaming"
    },
    {
        "id": 41,
        "name": "Emergency Incident reporting"
    },
    {
        "id": 42,
        "name": "Cross unit control and collaboration"
    },
    {
        "id": 43,
        "name": "Geolocation"
    },
    {
        "id": 44,
        "name": "eMBMS (Evolved Multimedia Broadcast Multicast Services)"
    },
    {
        "id": 45,
        "name": "Tactical communications bubble"
    },
    {
        "id": 46,
        "name": "Internet of Military Things (IoMT)"
    },
    {
        "id": 47,
        "name": "Emergency coordination"
    },
    {
        "id": 48,
        "name": "Train operator communications"
    },
    {
        "id": 49,
        "name": "Passenger safety and security"
    },
    {
        "id": 50,
        "name": "Rail infrastructure maintenance"
    },
    {
        "id": 51,
        "name": "EX Zone 1/21 & Cl1 Div.1"
    }
]

export const formFactors = [
    {
        "id": 1,
        "name": "LGA"
    },
    {
        "id": 2,
        "name": "M.2"
    },
    {
        "id": 3,
        "name": "PCI express"
    },
    {
        "id": 4,
        "name": "Half Mini PCI express"
    },
    {
        "id": 6,
        "name": "Integrated Device"
    },
    {
        "id": 7,
        "name": "Smartphone"
    },
    {
        "id": 8,
        "name": "Other"
    },
    {
        "id": 10,
        "name": "Tablet"
    },
    {
        "id": 11,
        "name": "Featurephone"
    },
    {
        "id": 12,
        "name": "miniPCIe"
    }
]

export const verticals = [
    {
        "id": 1,
        "name": "Connected Healthcare"
    },
    {
        "id": 2,
        "name": "IoT Consumer"
    },
    {
        "id": 3,
        "name": "IoT Industrial"
    },
    {
        "id": 4,
        "name": "Smart Agriculture"
    },
    {
        "id": 5,
        "name": "Smart Buildings"
    },
    {
        "id": 6,
        "name": "Smart Cities"
    },
    {
        "id": 7,
        "name": "Smart Homes"
    },
    {
        "id": 8,
        "name": "Oil & Gas"
    },
    {
        "id": 9,
        "name": "Telecom"
    },
    {
        "id": 10,
        "name": "Transportation & Logistics"
    },
    {
        "id": 11,
        "name": "Other"
    },
    {
        "id": 12,
        "name": "Manufacturing"
    },
    {
        "id": 13,
        "name": "Mining"
    },
    {
        "id": 14,
        "name": "Airport"
    },
    {
        "id": 15,
        "name": "Ports"
    },
    {
        "id": 16,
        "name": "Warehouse"
    },
    {
        "id": 17,
        "name": "Energy Plants"
    },
    {
        "id": 18,
        "name": "Venues"
    },
    {
        "id": 19,
        "name": "Media"
    },
    {
        "id": 22,
        "name": "Defense"
    },
    {
        "id": 23,
        "name": "Utilities"
    },
    {
        "id": 24,
        "name": "Railway"
    },
    {
        "id": 25,
        "name": "Public Safety"
    },
    {
        "id": 26,
        "name": "Digital Airspace"
    }
]
export const deviceTypes = [
    {
        "id": 1,
        "name": "Module & Chipset"
    },
    {
        "id": 2,
        "name": "Handhelds & Wearables"
    },
    {
        "id": 4,
        "name": "Internet of Things"
    },
    {
        "id": 7,
        "name": "Gateway & Dongles"
    },
    {
        "id": 8,
        "name": "Data Card"
    },
    {
        "id": 10,
        "name": "Development Kit"
    },
    {
        "id": 11,
        "name": "Robotics & Machinery"
    },
    {
        "id": 12,
        "name": "Vehicles AGV & Drones"
    },
    {
        "id": 13,
        "name": "Scanner & Cameras"
    },
    {
        "id": 14,
        "name": "Sensors & Actuators"
    },
    {
        "id": 15,
        "name": "Trackers"
    },
    {
        "id": 16,
        "name": "Other"
    },
    {
        "id": 18,
        "name": "Vehicle Mounted"
    }
]

export const categoryValues: Record<Category, readonly CategoryValue[]> = {
  [Category.WIFI_TYPE]: wifiType,
  [Category.BLUETOOTH]: bluetooth,
  [Category.ESIM]: esim,
  [Category.FEATURE_3GPP]: feature3gpp,
  [Category.NETWORK_TECHNOLOGIES]: networkTechnologies,
  [Category.USE_CASES]: useCases,
  [Category.FORM_FACTORS]: formFactors,
  [Category.VERTICALS]: verticals,
  [Category.DEVICE_TYPES]: deviceTypes,
};
