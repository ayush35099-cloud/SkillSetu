import os
from . import db
from .models import (
    User,
    AssessmentTask,
    AssessmentRubric,
    AssessmentSubmission,
    AssessmentReview,
    AssessmentCriterionResult,
    SkillCredential,
    ContractorProfile,
    JobPosting,
    JobApplication,
    ContactRequest
)

TASKS_DATA = [
    # 1. Electrician
    {
        "trade": "electrician",
        "task_title": "De-energized Conduit Bending & Distribution Board MCB Termination",
        "difficulty_level": "Intermediate",
        "safety_instructions": "STRICT DE-ENERGIZED BENCHMARK SETUP. No live electricity allowed during demonstration. Wear 1000V rated insulated footwear and clear eye protection. Use Lockout/Tagout (LOTO) protocol on the demo panel.",
        "required_tools": "Conduit pipe bender, Insulated screwdrivers (1000V rated), Wire strippers, Digital Multimeter, MCB 16A single-pole, Saddle clamps.",
        "task_description": "Worker must mount a 20mm PVC conduit pipe with a 90-degree offset bend onto a vertical demonstration board, pull 2.5 sq mm copper cables through the conduit, and cleanly terminate phase and neutral into a distribution board MCB with correct torque and zero exposed strand copper.",
        "rubrics": [
            {
                "criterion_name": "Personal Protective Equipment & Safe De-Energized Protocol",
                "criterion_description": "Verification of safety shoes, eye protection, and confirming power supply disconnect with digital multimeter before touching terminals.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Conduit Bending & Saddle Mounting Accuracy",
                "criterion_description": "Smooth 90-degree bend with no kinking, uniform saddle clamp spacing, and secure mechanical mounting to the demonstration board.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Cable Stripping, Dressing & MCB Terminal Termination",
                "criterion_description": "Proper insulation stripping length (10-12mm), no nicked or severed copper strands, neat cable dressing, and firm screw torque.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Circuit Continuity & Polarity Verification",
                "criterion_description": "Demonstrating continuity check using multimeter beep mode, zero resistance loop test, and correct phase/neutral identification.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "electrician",
        "task_title": "Earthing Pit Electrode Resistance Measurement & Continuity Check",
        "difficulty_level": "Advanced",
        "safety_instructions": "Low-voltage 4-terminal earth resistance testing equipment only. Ensure area around test spikes is clear and dry before measurement.",
        "required_tools": "Digital Earth Tester (4-terminal), Test spikes (2 units), Insulated connecting leads (5m, 10m, 20m), Copper earth strip, Megger continuity probe.",
        "task_description": "Demonstrate setup of earth electrode test leads with proper 5m-10m spike distance spacing, calibrate digital tester, and execute fall-of-potential resistance measurement to verify earthing impedance below 5 Ohms as per IS 3043 standard.",
        "rubrics": [
            {
                "criterion_name": "Spike Layout & Fall-of-Potential Lead Alignment",
                "criterion_description": "Proper geometric spacing of current and potential test spikes in a straight line from the grounding pit.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Digital Tester Calibration & Zero Resistance Check",
                "criterion_description": "Short-circuit calibration of test leads before measurement to ensure high accuracy.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Resistance Value Reading & Tolerance Compliance (<5Ω)",
                "criterion_description": "Accurately taking 3-point potential check and confirming reading satisfies IS 3043 safety code.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Earth Strip Mechanical Bonding & Anti-Corrosion Wrap",
                "criterion_description": "Inspecting copper bond tightness, lock washer usage, and corrosion resistance coating on terminal lugs.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },

    # 2. Plumber
    {
        "trade": "plumber",
        "task_title": "Concealed CPVC/UPVC Pipe Network Routing & Hydrostatic Pressure Test",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Wear cut-resistant work gloves and protective goggles. Work in a well-ventilated space when applying solvent cement.",
        "required_tools": "CPVC pipe cutter, CPVC solvent cement & primer, Deburring reamer, Hydrostatic manual test pump, Pressure gauge (0-15 bar), Teflon tape, Brass elbows & tees.",
        "task_description": "Cut, deburr, align, and solvent-weld a 4-joint CPVC supply loop with an isolation ball valve, connect the hydrostatic test pump, and pressurize the line to 10 bar for 15 minutes without pressure drop or fitting leaks.",
        "rubrics": [
            {
                "criterion_name": "Square Pipe Cutting, Reaming & Surface Chamfering",
                "criterion_description": "Pipes cut precisely 90 degrees square with zero burrs, shavings, or internal obstructions.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Solvent Cement Application & Insertion Technique",
                "criterion_description": "Even primer and solvent coat on both pipe and socket; inserting with a quarter-turn twist and holding for 30 seconds.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Dimensional Alignment & Right-Angle Fit Accuracy",
                "criterion_description": "All fittings aligned square to the test board plane with proper pipe clip support spacing.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Hydrostatic Pressure Hold Verification (10 Bar)",
                "criterion_description": "Pumping line to 10 bar, locking off isolation valve, and verifying zero pressure drop over 15 minutes.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "plumber",
        "task_title": "Sanitary Drainage Line Slope Alignment & P-Trap Installation",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Slip-resistant safety boots and nitrile gloves. Avoid over-tightening plastic slip-nut threads.",
        "required_tools": "SWR PVC pipes (75mm/110mm), P-trap fitting, Rubber gasket seals, Spirit level with gradient markings, Pipe lubricant, Hacksaw.",
        "task_description": "Assemble a waste drainage line incorporating an anti-siphon P-trap, ensure a uniform 1:50 drainage slope (2cm per meter) using a spirit level, and verify self-scouring water flow and airtight water seal depth.",
        "rubrics": [
            {
                "criterion_name": "Gradient Slope Measurement (1:50 Standard)",
                "criterion_description": "Uniform gradient maintained across the full drainage run without sagging or back-pitch.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Gasket Ring Sealing & Lubricated Push-Fit Jointing",
                "criterion_description": "Correct seating of rubber O-ring in bell end with zero pinching or twisting during assembly.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "P-Trap Water Seal Depth & Alignment",
                "criterion_description": "Trap installed level with minimum 50mm water seal depth to prevent sewer gas entry.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Full Gravity Flow Drainage & Joint Tightness",
                "criterion_description": "Simulated bucket flush test showing rapid unhindered discharge with zero weeping around collar joints.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },

    # 3. Mason
    {
        "trade": "mason",
        "task_title": "90-Degree Corner Brickwork with Plumb Line & Spirit Level Alignment",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Wear heavy-duty steel toe work boots, dust respirator, and heavy-duty nitrile work gloves. Safe lifting posture.",
        "required_tools": "Masonry trowel (10-inch), Plumb bob & line, 3-vial spirit level (600mm), Right-angle builder's square, Mortar pan, Masonry hammer.",
        "task_description": "Mix 1:4 cement-sand mortar to ideal plasticity, lay an English bond 4-course corner corner wall (quoin), demonstrate plumb line accuracy within ±2mm tolerance, and strike clean uniform 10mm mortar joints.",
        "rubrics": [
            {
                "criterion_name": "Mortar Hydration, Consistency & Bed Spreading",
                "criterion_description": "Smooth workable mortar with no dry lumps or excessive water runoff; uniform bed spreading across bricks.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "True Vertical Plumb Line Accuracy (±2mm)",
                "criterion_description": "Plumb bob test along outer and inner corner faces within tight 2mm standard tolerance.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Horizontal Bed Level & Corner 90° Squareness",
                "criterion_description": "Using 3-vial spirit level along both walls and verifying 90-degree right angle with steel builder's square.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Uniform Joint Thickness & Clean Raking / Pointing",
                "criterion_description": "Consistent 10mm horizontal and vertical joints with excess mortar struck clean without face smearing.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "mason",
        "task_title": "Level Screeding & Surface Preparation for Vitrified Tile Bedding",
        "difficulty_level": "Advanced",
        "safety_instructions": "Knee pads, dust protection, and ergonomic kneeling technique.",
        "required_tools": "Straight aluminum screed bar (1.8m), Spirit level, Trowel, Level marking gauge, Cement slurry brush, Compaction float.",
        "task_description": "Establish datum level reference pads, spread semi-dry cement mortar base (1:5), compact uniformly, and screed a 2m x 1m floor surface flat within 3mm tolerance ready for tile installation.",
        "rubrics": [
            {
                "criterion_name": "Datum Level Pad Setting & Grade Reference",
                "criterion_description": "Accurate transfer of room datum height and formation of level guide pads at both ends.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Mortar Compaction & Void Elimination",
                "criterion_description": "Thorough tamping of mortar bed to eliminate internal hollow pockets and air cavities.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Straight Edge Screed Floating Accuracy",
                "criterion_description": "Continuous sawing motion of screed bar between pads resulting in a true level plane without dips.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Surface Texture Uniformity & Zero Hollowing",
                "criterion_description": "Fine-textured finish suitable for polymer tile adhesive bonding with no loose surface sand.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },

    # 4. Carpenter
    {
        "trade": "carpenter",
        "task_title": "Square Mortise & Tenon Joint Fabrication for Timber Frame",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Always chisel in direction away from hands and body. Wear clear impact eye shields and dust mask.",
        "required_tools": "Crosscut hand saw, Tenon saw, Wood chisel set (12mm, 18mm), Mortise marking gauge, Combination square, Mallet.",
        "task_description": "Mark, saw, and chisel a traditional through-tenon and matching mortise joint in 50x50mm hardwood, ensuring squareness across all reference faces and a friction-tight fit with zero shoulder gap.",
        "rubrics": [
            {
                "criterion_name": "Marking Gauge Precision & Knife Wall Scoring",
                "criterion_description": "Clean, crisp scribe lines from face side and face edge with zero double lines.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Tenon Shoulder & Cheek Sawing Accuracy",
                "criterion_description": "Sawing on waste side of line, straight tenon cheeks, and 90-degree square shoulder cuts.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Mortise Chopping & Clean Side Wall Alignment",
                "criterion_description": "Vertical mortise walls with clean bottom extraction and zero tear-out on visible edges.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Joint Assembly Fit & Squareness Under Combination Square",
                "criterion_description": "Firm hand-push fit, zero light visible through joint shoulders, and perfect 90° frame angle.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "carpenter",
        "task_title": "Modular Cabinet Carcass Assembly & Concealed Hinge Alignment",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Clamping panels securely before drilling. Ear protection when operating cordless power drivers.",
        "required_tools": "Cordless impact driver, 35mm Forstner hinge bit, Combination square, Corner clamping jig, 18mm plywood test panels, Soft-close hinges.",
        "task_description": "Bore 35mm concealed cup hinge recesses at standard 22mm offset, assemble a 600x400mm modular carcass with confirmat screws, mount the door, and adjust the 3-way hinge screws for a flush 2mm reveal.",
        "rubrics": [
            {
                "criterion_name": "Forstner Cup Hinge Boring Depth & Edge Offset",
                "criterion_description": "Accurate 11.5mm depth without punching through panel face, exactly 5mm margin from door edge.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Carcass Diagonal Squareness & Screw Centering",
                "criterion_description": "Equal diagonal corner measurements (within 1mm) and flush panel edge joints.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "3-Way Hinge Adjustment & Uniform Door Gap (2mm)",
                "criterion_description": "Equal reveal along top, bottom, and side margins using depth and lateral screws.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Smooth Soft-Close Action & Hardware Flushness",
                "criterion_description": "Silent door closing, no binding or rubbing against frame, and flush screw head driving.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },

    # 5. Welder
    {
        "trade": "welder",
        "task_title": "Structural Mild Steel Fillet Weld in 2F Horizontal Position",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Full welding PPE: Auto-darkening helmet (Shade 10-11), Leather welding jacket/apron, Heavy gauntlet gloves, Proper fume ventilation.",
        "required_tools": "SMAW Inverter welding machine, E6013/E7018 electrodes (3.15mm), Chipping hammer, Wire brush, Angle grinder, 6mm mild steel plates.",
        "task_description": "Clean joint surfaces with angle grinder, tack-weld a T-joint, execute a continuous 150mm single-pass fillet weld in 2F position, chip slag clean, and demonstrate uniform leg length and zero undercut.",
        "rubrics": [
            {
                "criterion_name": "Joint Preparation, Fit-Up & Tack Welds",
                "criterion_description": "Mill scale ground to bare shiny metal, tight 90° T-fit, and small solid tack welds at both ends.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Arc Strike, Travel Speed & Electrode Angle (45°)",
                "criterion_description": "Smooth arc strike without stray arc strikes, consistent travel angle and steady progression.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Fillet Weld Bead Profile, Uniformity & Leg Length",
                "criterion_description": "Uniform 6mm leg length, slightly convex bead face, and consistent ripple spacing.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Slag Removal & Freedom from Visual Defects",
                "criterion_description": "Complete slag detachment, zero porosity bubbles, zero undercut along top toe, and solid crater fill.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "welder",
        "task_title": "V-Groove Butt Joint Alignment & Root Pass Penetration",
        "difficulty_level": "Advanced",
        "safety_instructions": "High-heat protective equipment, secure ground clamp connection to workpiece.",
        "required_tools": "SMAW/MIG welding unit, 8mm steel plates with 30° bevels, Bevel angle gauge, Chipping hammer, Root gap spacers (2.5mm).",
        "task_description": "Fit up two 8mm beveled plates with a 2.5mm root gap and 1.5mm root face, complete full-penetration root pass and capping pass, demonstrating complete keyhole fusion.",
        "rubrics": [
            {
                "criterion_name": "Root Gap & Bevel Alignment Verification",
                "criterion_description": "Uniform 2.5mm root gap along the entire 200mm joint with zero plate misalignment.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Root Pass Keyhole Fusion & Back Penetration",
                "criterion_description": "Full root penetration visible on backside (1-2mm reinforcement) with zero burn-through.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Interpass Cleaning & Capping Pass Uniformity",
                "criterion_description": "Thorough wire brushing between passes and smooth uniform cap layer overlapping bevel edges by 1.5mm.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Weld Integrity & Absence of Cracks / Cold Lap",
                "criterion_description": "Clean transitions between passes with zero cold lapping, spatter buildup, or surface inclusions.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },

    # 6. Painter
    {
        "trade": "painter",
        "task_title": "Wall Surface Putty Application, Sanding & Primer Leveling",
        "difficulty_level": "Intermediate",
        "safety_instructions": "N95 particulate respirator mask, eye safety goggles, floor drop-cloth masking.",
        "required_tools": "Putty blades (8-inch & 10-inch), Acrylic wall putty, Sanding block with 180 & 220 grit paper, Lambswool roller, Water-based primer.",
        "task_description": "Repair drywall/plaster surface cracks, apply two ultra-thin coats of acrylic putty crosswise, sand to zero visible blade lap marks under inspection light, and apply uniform primer coat.",
        "rubrics": [
            {
                "criterion_name": "Surface Preparation, Cleaning & Crack Filling",
                "criterion_description": "Scraping loose paint, dusting surface, and properly opening and filling micro-cracks.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Thin-Coat Putty Spreading & Blade Handling Technique",
                "criterion_description": "Smooth 45° blade angle, cross-directional second coat, and minimal edge ridges.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Sanding Finish & Light Reflection Flatness",
                "criterion_description": "Feathered edges, smooth velvet touch with 220-grit paper, and zero shadow marks under oblique light.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Primer Application & Worksite Cleanliness",
                "criterion_description": "Uniform primer seal with zero roller drips or runs; clean drop cloths and sharp border lines.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "painter",
        "task_title": "Precision Freehand Edge Cutting-In & Two-Coat Emulsion Finish",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Stable stepladder footing, avoid over-reaching, adequate indoor ventilation.",
        "required_tools": "2-inch angled sash brush, 9-inch woven microfiber roller (10mm nap), Paint tray, Acrylic interior emulsion, Rag.",
        "task_description": "Cut in a crisp, laser-straight ceiling/wall line freehand using an angled sash brush, roll on two uniform emulsion coats maintaining a wet edge, with zero lap lines or orange peel texture.",
        "rubrics": [
            {
                "criterion_name": "Freehand Sash Cutting-In Straightness & Precision",
                "criterion_description": "Sharp razor-straight junction line with ceiling without paint bleeding onto adjacent trim.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Roller Loading, Distribution & Wet Edge Maintenance",
                "criterion_description": "Even roller tray loading without splattering, continuous W-pattern spreading, and wet edge preservation.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Color Opacity, Sheen Uniformity & Texture",
                "criterion_description": "Full two-coat hiding power with zero roller lap flashing, stippling, or thin patches.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Housekeeping, Edge Masking & Tool Maintenance",
                "criterion_description": "Thorough cleaning of brushes, no paint spills on flooring, and prompt wipe-down of trim.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },

    # 7. Mechanic
    {
        "trade": "mechanic",
        "task_title": "Automotive Disc Brake Caliper Overhaul & Hydraulic Bleeding",
        "difficulty_level": "Intermediate",
        "safety_instructions": "Always support vehicle on rated jack stands with wheel chocks. Wear nitrile gloves and brake cleaner eye protection.",
        "required_tools": "Hydraulic floor jack & safety stands, Torque wrench, Brake caliper piston reset tool, Line bleeding kit with clear tube, DOT4 fluid.",
        "task_description": "Safely elevate vehicle, remove caliper and friction pads, inspect rotor runout with vernier gauge, lubricate slide pins with silicone grease, install new pads, and bleed hydraulic lines until zero air bubbles appear.",
        "rubrics": [
            {
                "criterion_name": "Vehicle Lifting Safety & Mechanical Jack Stand Placement",
                "criterion_description": "Correct chassis lift points, solid jack stand engagement, and shaking car test before wheel removal.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Caliper Slide Pin Inspection, Cleaning & Lubrication",
                "criterion_description": "Smooth pin movement, clean rubber boots, and correct high-temperature synthetic brake grease application.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Hardware Torquing & Brake Pad Clip Installation",
                "criterion_description": "Anti-rattle clips properly installed, caliper guide pins torqued to manufacturer specifications using torque wrench.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Hydraulic Bleeding Protocol & Firm Pedal Feel",
                "criterion_description": "Correct bleeding sequence, clear fluid discharge with zero bubbles, and firm solid brake pedal response.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "mechanic",
        "task_title": "Four-Stroke Engine Compression Testing & Spark Plug Diagnostics",
        "difficulty_level": "Advanced",
        "safety_instructions": "Ensure ignition system and fuel pump relay are disabled before cranking. Cool engine handling.",
        "required_tools": "Engine compression tester gauge set (14mm/12mm), Spark plug socket & ratchet, Feeler gauge, Wire brush, Multimeter.",
        "task_description": "Disable ignition/fuel delivery, remove spark plugs and analyze electrode wear, thread compression gauge into cylinder head, crank engine at WOT for 5 pulses, record dry vs wet psi, and interpret cylinder health.",
        "rubrics": [
            {
                "criterion_name": "Ignition & Fuel Circuit Isolation Safety",
                "criterion_description": "Proper removal of fuel injection fuse/relay and grounding of high-tension coil leads before test.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Spark Plug Reading & Electrode Gap Adjustment",
                "criterion_description": "Accurately identifying normal vs carbon-fouled vs lean deposits; setting gap with feeler gauge to 0.8mm.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Compression Gauge Threading & WOT Cranking Execution",
                "criterion_description": "Finger-tight gauge seating without cross-threading; holding throttle wide open during 5 full compression strokes.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Pressure Diagnostic Analysis & Cylinder Variance Evaluation",
                "criterion_description": "Reading cylinder psi and comparing cylinder-to-cylinder variance within 10% factory tolerance.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },

    # 8. Technician
    {
        "trade": "technician",
        "task_title": "Inverter UPS Battery Wiring & Load Continuity Commissioning",
        "difficulty_level": "Intermediate",
        "safety_instructions": "High DC current short-circuit prevention. Insulated spanners only. Acid splash safety goggles and baking soda neutralizing kit.",
        "required_tools": "Digital multimeter, Insulated ring spanners (10mm & 13mm), Wire crimper, 16 sq mm DC copper cable, Battery terminal petroleum jelly, Hydrometer.",
        "task_description": "Assemble a 24V dual-battery bank in series, verify terminal polarity and electrolyte specific gravity, connect to high-efficiency inverter with correctly sized DC fuse, and verify automated transfer under 800W resistive load.",
        "rubrics": [
            {
                "criterion_name": "DC Terminal Polarity & Series Wiring Connection",
                "criterion_description": "Positive to negative series connection verified with digital voltmeter (24.8V nominal reading).",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Terminal Lug Torquing & Anti-Corrosion Protection",
                "criterion_description": "Solid bolt torquing without lead post twisting; clean protective petroleum jelly application over terminals.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Inverter DC Fuse Sizing & Cable Routing Safety",
                "criterion_description": "Correct high-amperage inline fuse installed on positive lead within 300mm of battery terminal.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "AC Mains Failure Transfer Time & Output Load Test",
                "criterion_description": "Simulating grid power outage; verifying inverter switchover under 15ms and steady 230V AC output under load.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    },
    {
        "trade": "technician",
        "task_title": "Split Air-Conditioner Flare Connection & Deep Vacuum Holding Test",
        "difficulty_level": "Advanced",
        "safety_instructions": "Safety glasses and thermal gloves when handling refrigerant ports. Vacuum pump grounded.",
        "required_tools": "Eccentric flaring tool, Tube cutter & reamer, Torque wrench set (17mm, 22mm), 2-stage rotary vacuum pump, Digital micron gauge, Manifold gauge.",
        "task_description": "Ream copper tubing (1/4\" and 1/2\"), form smooth 45° SAE flare cones with zero cracks, torque flare nuts to specification, draw a deep vacuum below 500 microns, and execute a 15-minute standing vacuum decay test.",
        "rubrics": [
            {
                "criterion_name": "Copper Tube Reaming & Eccentric Flare Forming",
                "criterion_description": "Internal burrs completely reamed downward; flare cone mirror-smooth with zero lip splitting or thinning.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 1
            },
            {
                "criterion_name": "Calibrated Flare Nut Torquing without Thread Damage",
                "criterion_description": "Using click-type torque wrench to exact specification (18 Nm for 1/4\", 42 Nm for 1/2\") without over-tightening.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 2
            },
            {
                "criterion_name": "Two-Stage Vacuum Evacuation (< 500 Microns)",
                "criterion_description": "Reaching and holding deep vacuum below 500 microns to ensure complete moisture and non-condensable gas removal.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 3
            },
            {
                "criterion_name": "Standing Vacuum Decay Leak Test (15 Minutes)",
                "criterion_description": "Isolating manifold gauge and confirming micron level does not rise above 750 microns over 15 minutes.",
                "max_score": 25,
                "weight": 1.0,
                "display_order": 4
            }
        ]
    }
]

def seed_database(app):
    """Seed tasks, rubrics, demo assessors, admin, and sample submissions safely."""
    with app.app_context():
        # 1. Seed Assessment Tasks & Rubrics (if none exist)
        if AssessmentTask.query.first() is None:
            app.logger.info("Seeding 8 trades with 16 practical assessment tasks and rubrics...")
            for task_info in TASKS_DATA:
                rubrics_info = task_info.get("rubrics", [])
                task_fields = {k: v for k, v in task_info.items() if k != "rubrics"}
                task = AssessmentTask(**task_fields)
                db.session.add(task)
                db.session.flush()

                for rubric_item in rubrics_info:
                    rubric = AssessmentRubric(task_id=task.id, **rubric_item)
                    db.session.add(rubric)

            db.session.commit()
            app.logger.info("Assessment tasks and rubrics seeded successfully.")
        else:
            app.logger.info("Assessment tasks already exist in database; skipping task seeding.")

        # 2. Seed Default Demo Assessor (Rajesh Sharma - Approved)
        assessor = User.query.filter_by(email="assessor@skillsetu.in").first()
        if not assessor:
            assessor = User(
                full_name="Rajesh Sharma (Master Assessor)",
                email="assessor@skillsetu.in",
                role="assessor",
                professional_qualification="National Skill Trainer (ITI & NSDC Master Assessor)",
                years_of_experience=14,
                specialisation="electrician",
                verification_status="approved"
            )
            assessor.set_password(os.getenv("SEED_ASSESSOR_PASSWORD", "Assessor@123"))
            db.session.add(assessor)
            db.session.commit()
            app.logger.info("Demo approved assessor account created: assessor@skillsetu.in")

        # 3. Seed Default Demo Pending Assessor (Vikram Patel - Pending)
        pending_assessor = User.query.filter_by(email="vikram.assessor@skillsetu.in").first()
        if not pending_assessor:
            pending_assessor = User(
                full_name="Vikram Patel (Vocational Evaluator)",
                email="vikram.assessor@skillsetu.in",
                role="assessor",
                professional_qualification="Diploma in Civil & Mechanical Technology",
                years_of_experience=6,
                specialisation="mason",
                verification_status="pending"
            )
            pending_assessor.set_password(os.getenv("SEED_ASSESSOR_PASSWORD", "Assessor@123"))
            db.session.add(pending_assessor)
            db.session.commit()
            app.logger.info("Demo pending assessor account created: vikram.assessor@skillsetu.in")

        # 4. Seed Default Demo Admin
        admin = User.query.filter_by(email="admin@skillsetu.in").first()
        if not admin:
            admin = User(
                full_name="SkillSetu System Administrator",
                email="admin@skillsetu.in",
                role="admin",
                professional_qualification="Vocational Standards & Governance Lead",
                years_of_experience=10,
                specialisation="administration",
                verification_status="approved"
            )
            admin.set_password(os.getenv("SEED_ADMIN_PASSWORD", "Admin@123"))
            db.session.add(admin)
            db.session.commit()
            app.logger.info("Demo admin account created: admin@skillsetu.in")

        # 5. Seed Default Demo Workers (Ramesh Kumar, Kavita Devi)
        worker_ramesh = User.query.filter_by(email="worker@skillsetu.in").first()
        if not worker_ramesh:
            worker_ramesh = User(
                full_name="Ramesh Kumar",
                email="worker@skillsetu.in",
                phone="9876543210",
                location="Bengaluru, Karnataka",
                role="worker",
                professional_qualification="Certified Building Electrician",
                years_of_experience=8,
                specialisation="electrician",
                verification_status="approved"
            )
            worker_ramesh.set_password(os.getenv("SEED_WORKER_PASSWORD", "Worker@123"))
            db.session.add(worker_ramesh)
            db.session.commit()
            app.logger.info("Demo worker account created: worker@skillsetu.in")

        worker_kavita = User.query.filter_by(email="kavita.devi@skillsetu.in").first()
        if not worker_kavita:
            worker_kavita = User(
                full_name="Kavita Devi",
                email="kavita.devi@skillsetu.in",
                phone="9765432109",
                location="Patna, Bihar",
                role="worker",
                professional_qualification="Solar PV Installation & Wiring Technician",
                years_of_experience=6,
                specialisation="technician",
                verification_status="approved"
            )
            worker_kavita.set_password(os.getenv("SEED_WORKER_PASSWORD", "Worker@123"))
            db.session.add(worker_kavita)
            db.session.commit()
            app.logger.info("Demo worker account created: kavita.devi@skillsetu.in")

        # 6. Seed Sample Submissions (if none exist)
        if AssessmentSubmission.query.first() is None:
            elec_task = AssessmentTask.query.filter_by(trade="electrician").first()
            plumb_task = AssessmentTask.query.filter_by(trade="plumber").first()
            mason_task = AssessmentTask.query.filter_by(trade="mason").first()
            tech_task = AssessmentTask.query.filter_by(trade="technician").first()

            if elec_task and plumb_task and mason_task:
                # Submission 1: Ramesh Kumar (Pending)
                sub1 = AssessmentSubmission(
                    worker_id=worker_ramesh.id,
                    worker_name=worker_ramesh.full_name,
                    worker_phone=worker_ramesh.phone,
                    worker_trade="electrician",
                    worker_experience=worker_ramesh.years_of_experience,
                    worker_location=worker_ramesh.location,
                    task_id=elec_task.id,
                    evidence_url="https://images.pexels.com/photos/31199578/pexels-photo-31199578.jpeg",
                    evidence_type="image",
                    submission_notes="Demonstrated PVC conduit 90-degree saddle bending and 16A MCB termination on test board. Verified zero exposed copper strands and confirmed continuity using digital multimeter.",
                    status="pending"
                )
                db.session.add(sub1)

                # Submission 2: Suresh Patel (Pending)
                sub2 = AssessmentSubmission(
                    worker_id=102,
                    worker_name="Suresh Patel",
                    worker_phone="9812345678",
                    worker_trade="plumber",
                    worker_experience=5,
                    worker_location="Ahmedabad, Gujarat",
                    task_id=plumb_task.id,
                    evidence_url="https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg",
                    evidence_type="image",
                    submission_notes="Assembled 1-inch CPVC hot and cold line loop with brass elbow fittings and CPVC solvent cement. Conducted 10-bar hydrostatic pressure holding test for 15 minutes without joint weeping.",
                    status="pending"
                )
                db.session.add(sub2)

                # Submission 3: Mohd. Aslam (Under Review)
                sub3 = AssessmentSubmission(
                    worker_id=103,
                    worker_name="Mohd. Aslam",
                    worker_phone="9845678901",
                    worker_trade="mason",
                    worker_experience=9,
                    worker_location="Delhi (NCT)",
                    task_id=mason_task.id,
                    evidence_url="https://images.pexels.com/photos/39779295/pexels-photo-39779295.jpeg",
                    evidence_type="image",
                    submission_notes="Built 4-course English bond corner wall with 1:4 cement-sand mix. Verified 90-degree builder's square and checked vertical plumb within 1.5mm tolerance.",
                    status="under_review"
                )
                db.session.add(sub3)

                # Submission 4: Kavita Devi (Approved with Review)
                if tech_task:
                    sub4 = AssessmentSubmission(
                        worker_id=worker_kavita.id,
                        worker_name=worker_kavita.full_name,
                        worker_phone=worker_kavita.phone,
                        worker_trade="technician",
                        worker_experience=worker_kavita.years_of_experience,
                        worker_location=worker_kavita.location,
                        task_id=tech_task.id,
                        evidence_url="https://images.pexels.com/photos/31321047/pexels-photo-31321047.jpeg",
                        evidence_type="image",
                        submission_notes="Commissioned 24V inverter dual battery setup with 16 sq mm DC cables and protective terminal grease. Tested automatic 12ms transfer under 800W resistive load.",
                        status="approved"
                    )
                    db.session.add(sub4)
                    db.session.flush()

                    # Add an approved review by Rajesh Sharma
                    review = AssessmentReview(
                        submission_id=sub4.id,
                        assessor_id=assessor.id,
                        total_score=94.0,
                        maximum_score=100.0,
                        overall_feedback="Outstanding demonstration of DC safety protocols, terminal polarity checking, and seamless inverter switchover timing. Wiring is exceptionally clean and compliant with national safety standards.",
                        decision="approved"
                    )
                    db.session.add(review)
                    db.session.flush()

                    # Add criterion results for the 4 rubrics
                    for rubric in tech_task.rubrics:
                        score = 23.5 if rubric.max_score == 25 else rubric.max_score * 0.94
                        res = AssessmentCriterionResult(
                            review_id=review.id,
                            rubric_id=rubric.id,
                            score=score,
                            assessor_comment="Exceeded benchmarks with high precision and adherence to safety protocols."
                        )
                        db.session.add(res)

                db.session.commit()
                app.logger.info("Sample submissions and review seeded successfully.")

        # 7. Idempotently ensure verified sample SkillCredential exists (even on already-seeded DBs)
        existing_cred = SkillCredential.query.filter(
            (SkillCredential.verification_token == "verify-kavita-devi-solarpv-2026")
            | (SkillCredential.credential_id == "SKILLSETU-2026-8842")
        ).first()
        if not existing_cred:
            kavita_sub = AssessmentSubmission.query.filter_by(
                worker_name="Kavita Devi",
                status="approved"
            ).first()
            if kavita_sub and kavita_sub.reviews:
                kavita_review = kavita_sub.reviews[0]
                cred = SkillCredential(
                    credential_id="SKILLSETU-2026-8842",
                    verification_token="verify-kavita-devi-solarpv-2026",
                    worker_id=kavita_sub.worker_id,
                    worker_name=kavita_sub.worker_name,
                    trade=kavita_sub.worker_trade or (kavita_sub.task.trade if kavita_sub.task else "technician"),
                    skill_level="Master Craftsman (94.0%)",
                    submission_id=kavita_sub.id,
                    review_id=kavita_review.id,
                    issued_by_admin_id=admin.id if admin else None,
                    status="active"
                )
                db.session.add(cred)
                db.session.commit()
                app.logger.info("Seeded verified Digital Skill Passport credential SKILLSETU-2026-8842.")

        # 8. Seed Demo Contractor Account and Profile (L&T Urban Infra Projects)
        contractor_user = User.query.filter_by(email="contractor@skillsetu.in").first()
        if not contractor_user:
            contractor_user = User(
                full_name="Vikramaditya Singhania",
                email="contractor@skillsetu.in",
                phone="9820012345",
                location="Mumbai, Maharashtra",
                role="contractor",
                professional_qualification="Director of Site Engineering & Project Procurement",
                years_of_experience=15,
                specialisation="contractor",
                verification_status="verified"
            )
            contractor_user.set_password(os.getenv("SEED_CONTRACTOR_PASSWORD", "Contractor@123"))
            db.session.add(contractor_user)
            db.session.flush()

            contractor_profile = ContractorProfile(
                user_id=contractor_user.id,
                company_name="L&T Urban Infra Projects",
                business_type="Infrastructure & Commercial Construction",
                gstin="27AAACL1234F1Z8",
                business_address="L&T Technology Center, Saki Vihar Road, Powai",
                city="Mumbai",
                state="Maharashtra",
                verification_status="verified",
                contact_email="procurement@lturbaninfra.com",
                contact_phone="+91 22 6705 2000",
                website="https://lturbaninfra.com",
                description="Premier civil engineering and commercial electrical contractor executing metro, data center, and smart city infrastructure projects across India."
            )
            db.session.add(contractor_profile)
            db.session.commit()
            app.logger.info("Demo contractor account created: contractor@skillsetu.in")

        # 9. Seed Sample Job Postings (if none exist for this contractor)
        if contractor_user and JobPosting.query.filter_by(contractor_id=contractor_user.id).first() is None:
            job1 = JobPosting(
                contractor_id=contractor_user.id,
                title="Senior Industrial Substation Electrician",
                trade="electrician",
                description="Required 5 qualified industrial electricians for power distribution board termination, 415V busbar trunking, and HT/LT panel testing at commercial datacenter site in Powai.",
                required_skills="HT/LT Panel Termination, Conduit Bending, Megger Testing, Cable Dressing, Busbar Jointing",
                workers_needed=5,
                experience_years=4,
                location="Powai Commercial Datacenter Site, Saki Vihar Road",
                city="Mumbai",
                state="Maharashtra",
                employment_type="Full-time",
                payment_type="Monthly",
                wage_min=28000.0,
                wage_max=36000.0,
                duration="12 Months (Extendable)",
                start_date="Immediate",
                working_hours="8 Hours / Day (General Shift: 9:00 AM - 5:30 PM)",
                safety_requirements="Mandatory 1000V insulated safety shoes, IS-standard helmet, and clear safety goggles. Arc-flash face shields provided on site.",
                contact_details="L&T Site Office, Powai. Tel: +91 22 6705 2100",
                status="active"
            )
            db.session.add(job1)

            job2 = JobPosting(
                contractor_id=contractor_user.id,
                title="High-Pressure CPVC & Fire Hydrant Plumbing Specialist",
                trade="plumber",
                description="Looking for 3 certified plumbers for multi-story residential tower utility line installation, CPVC riser joints, and 12-bar hydrostatic pressure testing.",
                required_skills="CPVC Solvent Welding, Fire Sprinkler Threading, Hydrostatic Testing, Pressure Reducer Valve Calibration",
                workers_needed=3,
                experience_years=3,
                location="Whitefield Tech Park Extension",
                city="Bengaluru",
                state="Karnataka",
                employment_type="Contract",
                payment_type="Daily",
                wage_min=1100.0,
                wage_max=1400.0,
                duration="6 Months",
                start_date="Within 1 Week",
                working_hours="8 Hours / Day (8:30 AM - 5:00 PM)",
                safety_requirements="Cut-resistant gloves, safety boots, safety harness for shaft installation.",
                contact_details="Site PM: +91 80 4123 9080",
                status="active"
            )
            db.session.add(job2)

            job3 = JobPosting(
                contractor_id=contractor_user.id,
                title="Solar PV & Backup Inverter Commissioning Technician",
                trade="technician",
                description="Immediate opening for 2 technicians to mount rooftop solar array microinverters, battery banks, and 24V/48V charge controllers.",
                required_skills="Solar PV String Inverters, DC Battery Bank Cabling, MC4 Crimping, Smart Meter Integration",
                workers_needed=2,
                experience_years=2,
                location="Okhla Industrial Area Phase-III",
                city="Delhi",
                state="Delhi (NCT)",
                employment_type="Full-time",
                payment_type="Monthly",
                wage_min=25000.0,
                wage_max=32000.0,
                duration="Ongoing / Permanent",
                start_date="Immediate",
                working_hours="9:00 AM - 6:00 PM",
                safety_requirements="Fall-arrest rooftop harness, UV protection glasses, insulated screwdrivers.",
                contact_details="Delhi Regional Hub. Email: solar.delhi@lturbaninfra.com",
                status="active"
            )
            db.session.add(job3)
            db.session.flush()

            # Seed sample application from Ramesh Kumar to Job 1
            if worker_ramesh:
                app1 = JobApplication(
                    job_id=job1.id,
                    worker_id=worker_ramesh.id,
                    status="applied",
                    cover_note="Experienced with industrial 415V panels and IS-standard conduit termination. Verified SkillSetu electrician ready for immediate joining."
                )
                db.session.add(app1)

            # Seed sample contact request from Contractor to Kavita Devi
            if worker_kavita:
                contact1 = ContactRequest(
                    contractor_id=contractor_user.id,
                    worker_id=worker_kavita.id,
                    job_id=job3.id,
                    message="Hello Kavita, we reviewed your verified SkillSetu Digital Skill Passport for Solar PV & Inverter Commissioning. We have an immediate requirement for rooftop solar technicians in Delhi. Would you be open to an interview?",
                    status="accepted",
                    worker_contact_shared=True
                )
                db.session.add(contact1)

            db.session.commit()
            app.logger.info("Sample jobs, application, and contact request seeded successfully.")
