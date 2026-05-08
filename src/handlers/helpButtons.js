import { createEmbed } from '../utils/embeds.js';
import { createSelectMenu } from '../utils/components.js';
import { createAllCommandsMenu } from './helpSelectMenus.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';

import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMAND_LIST_ID = "help-command-list";
const BACK_BUTTON_ID = "help-back-to-main";
const CATEGORY_SELECT_ID = "help-category-select";
const ALL_COMMANDS_ID = "help-all-commands";
const PAGINATION_PREFIX = "help-page";

const BUG_REPORT_BUTTON_ID = "help-bug-report";
const BUG_MODAL_ID = "bug-report-modal";
const BUG_INPUT_ID = "bug-report-input";

const CATEGORY_ICONS = {
    Core: "⚡",
    Moderation: "🛡️",
    Economy: "💰",
    Fun: "🎮",
    Leveling: "📈",
    Utility: "🔧",
    Ticket: "🎫",
    Welcome: "👋",
    Giveaway: "🎉",
    Counter: "🔢",
    Tools: "🛠️",
    Search: "🔍",
    Reaction_Roles: "🎭",
    Community: "🌍",
    Birthday: "🎂",
    Config: "⚙️",
};

async function createCategorySelectMenu() {

    const commandsPath = path.join(__dirname, "../commands");

    const categoryDirs = (
        await fs.readdir(commandsPath, { withFileTypes: true })
    )
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();

    const options = [
        {
            label: "📜 All Commands",
            description: "View every command available",
            value: ALL_COMMANDS_ID,
        },

        ...categoryDirs.map((category) => {

            const categoryName =
                category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase();

            const icon = CATEGORY_ICONS[categoryName] || "✨";

            return {
                label: `${icon} ${categoryName}`,
                description: `View ${categoryName} commands`,
                value: category,
            };
        }),
    ];

    const embed = createEmbed({
        title: "🤖 Apex Bot Help Center",
        description:
            "Advanced Discord utility bot packed with moderation, economy, fun, automation, and server management systems.\n\n" +
            "Use the dropdown below to explore all command categories.",
        color: "primary",
    });

    embed.addFields(
        {
            name: "🛡️ Moderation",
            value: "Ban, kick, timeout, warnings, automod",
            inline: true,
        },
        {
            name: "💰 Economy",
            value: "Coins, work, daily rewards, shop system",
            inline: true,
        },
        {
            name: "🎮 Fun",
            value: "Games, memes, entertainment commands",
            inline: true,
        },
        {
            name: "📈 Leveling",
            value: "XP system, ranks, progression",
            inline: true,
        },
        {
            name: "🎫 Tickets",
            value: "Professional support ticket system",
            inline: true,
        },
        {
            name: "🎉 Giveaways",
            value: "Fast giveaway management tools",
            inline: true,
        },
        {
            name: "🔧 Utility",
            value: "Helpful server management tools",
            inline: true,
        },
        {
            name: "🌍 Community",
            value: "Reaction roles, counters, engagement",
            inline: true,
        },
        {
            name: "⚙️ Config",
            value: "Customize your server systems",
            inline: true,
        }
    );

    embed.setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png");

    embed.setFooter({
        text: "Apex Bot • Made by dark_00.005",
    });

    embed.setTimestamp();

    const bugReportButton = new ButtonBuilder()
        .setCustomId(BUG_REPORT_BUTTON_ID)
        .setLabel("Report Bug")
        .setEmoji("🐛")
        .setStyle(ButtonStyle.Danger);

    const inviteButton = new ButtonBuilder()
        .setLabel("Invite Bot")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/oauth2/authorize?client_id=1501284170251632832&permissions=8&integration_type=0&scope=bot+applications.commands");

    const buttonRow = new ActionRowBuilder().addComponents([
        bugReportButton,
        inviteButton,
    ]);

    const selectRow = createSelectMenu(
        CATEGORY_SELECT_ID,
        "Select a category",
        options,
    );

    return {
        embeds: [embed],
        components: [buttonRow, selectRow],
    };
}

export const helpBackButton = {
    name: BACK_BUTTON_ID,

    async execute(interaction) {

        try {

            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferUpdate();
            }

            const { embeds, components } =
                await createCategorySelectMenu();

            await interaction.editReply({
                embeds,
                components,
            });

        } catch (error) {

            logger.error(error);
        }
    },
};

export const helpBugReportButton = {
    name: BUG_REPORT_BUTTON_ID,

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId(BUG_MODAL_ID)
            .setTitle("Bug Report");

        const bugInput = new TextInputBuilder()
            .setCustomId(BUG_INPUT_ID)
            .setLabel("Describe the bug")
            .setPlaceholder("Explain the issue in detail...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);

        const row = new ActionRowBuilder().addComponents(bugInput);

        modal.addComponents(row);

        await interaction.showModal(modal);
    },
};

export const helpBugModal = {
    name: BUG_MODAL_ID,

    async execute(interaction, client) {

        const report =
            interaction.fields.getTextInputValue(BUG_INPUT_ID);

        const owner = await client.users.fetch("1280516604148453387");

        const reportEmbed = createEmbed({
            title: "🐛 New Bug Report",
            description: report,
            color: "error",
        });

        reportEmbed.addFields(
            {
                name: "👤 User",
                value: `${interaction.user.tag}`,
                inline: true,
            },
            {
                name: "🏠 Server",
                value: `${interaction.guild?.name || "DM"}`,
                inline: true,
            }
        );

        reportEmbed.setTimestamp();

        await owner.send({
            embeds: [reportEmbed],
        });

        await interaction.reply({
            content:
                "✅ Your bug report has been sent to the developer.",
            flags: MessageFlags.Ephemeral,
        });
    },
};

export const helpReportCommand = {
    name: COMMAND_LIST_ID,
    categoryName: null,

    async execute(interaction, client) {

    },
};

function getPaginationInfo(components) {

    for (const row of components || []) {

        for (const component of row.components || []) {

            if (
                component.customId ===
                `${PAGINATION_PREFIX}_page`
            ) {

                const label = component.label || "";

                const match =
                    label.match(/Page\s+(\d+)\s+of\s+(\d+)/i);

                if (match) {

                    return {
                        currentPage: Number(match[1]),
                        totalPages: Number(match[2]),
                    };
                }
            }
        }
    }

    return {
        currentPage: 1,
        totalPages: 1,
    };
}

export const helpPaginationButton = {
    name: `${PAGINATION_PREFIX}_next`,

    async execute(interaction, client) {

        try {

            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferUpdate();
            }

            const { currentPage, totalPages } =
                getPaginationInfo(
                    interaction.message?.components
                );

            let nextPage = currentPage;

            switch (interaction.customId) {

                case `${PAGINATION_PREFIX}_first`:
                    nextPage = 1;
                    break;

                case `${PAGINATION_PREFIX}_prev`:
                    nextPage = Math.max(
                        1,
                        currentPage - 1
                    );
                    break;

                case `${PAGINATION_PREFIX}_next`:
                    nextPage = Math.min(
                        totalPages,
                        currentPage + 1
                    );
                    break;

                case `${PAGINATION_PREFIX}_last`:
                    nextPage = totalPages;
                    break;

                default:
                    nextPage = currentPage;
                    break;
            }

            const { embeds, components } =
                await createAllCommandsMenu(
                    nextPage,
                    client
                );

            await interaction.editReply({
                embeds,
                components,
            });

        } catch (error) {

            logger.error(error);
        }
    },
};
